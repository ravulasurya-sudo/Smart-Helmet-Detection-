import os
import sys
import time
import types
import pathlib
from pathlib import Path
import cv2
import numpy as np
import torch

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
UPLOADS_DIR = BASE_DIR / "uploads"
OUTPUTS_DIR = BASE_DIR / "outputs"
YOLOV5_DIR = BASE_DIR / "yolov5"

# Priority model weights: yolov5s_helmet_best.pt, fallback to best.pt
PRIMARY_WEIGHTS = MODELS_DIR / "yolov5s_helmet_best.pt"
FALLBACK_WEIGHTS = MODELS_DIR / "best.pt"
DEFAULT_MODEL_PATH = PRIMARY_WEIGHTS if PRIMARY_WEIGHTS.exists() else FALLBACK_WEIGHTS

# Ensure output directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

# Register cross-platform PosixPath compatibility on Windows (Google Colab Linux checkpoints)
pathlib.PosixPath = pathlib.WindowsPath
if 'pathlib._local' not in sys.modules:
    mod = types.ModuleType('pathlib._local')
    mod.PosixPath = pathlib.WindowsPath
    mod.WindowsPath = pathlib.WindowsPath
    sys.modules['pathlib._local'] = mod

# Configure Python import path to locate official YOLOv5 source modules
if str(YOLOV5_DIR) not in sys.path and YOLOV5_DIR.exists():
    sys.path.insert(0, str(YOLOV5_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Top-level import for IDE and type checker resolution
try:
    from models.experimental import attempt_load
    from models.common import AutoShape
except ImportError as err:
    # If not yet on sys.path in some external runners, attempt late import
    attempt_load = None
    AutoShape = None

class HelmetDetector:
    def __init__(self, model_path=None):
        if model_path:
            self.model_path = Path(model_path)
        else:
            self.model_path = PRIMARY_WEIGHTS if PRIMARY_WEIGHTS.exists() else FALLBACK_WEIGHTS
            
        self.model = None
        self.model_name = "YOLOv5s (Police Helmet Enforcement)"
        self.class_names = {0: "helmet", 1: "no_helmet"}
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.is_loaded = False
        self.load_model()

    def load_model(self):
        """
        Loads the trained YOLOv5 weights using official YOLOv5 architecture.
        """
        # Resolve target weights file
        if not self.model_path.exists():
            if PRIMARY_WEIGHTS.exists():
                self.model_path = PRIMARY_WEIGHTS
            elif FALLBACK_WEIGHTS.exists():
                self.model_path = FALLBACK_WEIGHTS
            else:
                print(f"[Detector] Checkpoint not found at {self.model_path}.")
                self.is_loaded = False
                return False

        try:
            # Ensure yolov5 is on sys.path
            if str(YOLOV5_DIR) not in sys.path:
                sys.path.insert(0, str(YOLOV5_DIR))
                
            from models.experimental import attempt_load as _attempt_load
            from models.common import AutoShape as _AutoShape
            
            print(f"[Detector] Loading YOLOv5 checkpoint: {self.model_path.name} onto {self.device}...")
            base_model = _attempt_load(str(self.model_path), device=self.device)
            self.model = _AutoShape(base_model)
            
            # Inspect and store class mapping
            if hasattr(base_model, "names") and base_model.names:
                self.class_names = base_model.names
            
            self.model_name = f"YOLOv5s ({self.model_path.name})"
            self.is_loaded = True
            print(f"[Detector] YOLOv5 model loaded successfully! Classes: {self.class_names}")
            return True
        except Exception as e:
            print(f"[Detector] Error loading YOLOv5 model: {e}")
            self.is_loaded = False
            return False

    def detect(self, image_path, conf_threshold=0.35):
        """
        Runs object detection on the uploaded traffic image.
        Returns annotated image path, counts, boxes, and inference time.
        """
        start_time = time.perf_counter()
        
        # Ensure model is loaded
        if not self.is_loaded or self.model is None:
            if self.model_path.exists() or PRIMARY_WEIGHTS.exists():
                self.load_model()

        # Load image safely on Windows (handles unicode and spaces)
        try:
            image = cv2.imdecode(np.fromfile(str(image_path), dtype=np.uint8), cv2.IMREAD_COLOR)
        except Exception:
            image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(f"Could not read image file at {image_path}")

        img_h, img_w = image.shape[:2]
        helmets_count = 0
        violations_count = 0
        detections = []

        if self.is_loaded and self.model is not None:
            # Set confidence threshold on AutoShape model
            self.model.conf = float(conf_threshold)
            
            # Run inference
            results = self.model(image, size=640)
            preds = results.pandas().xyxy[0]
            
            for _, row in preds.iterrows():
                x1, y1 = int(row['xmin']), int(row['ymin'])
                x2, y2 = int(row['xmax']), int(row['ymax'])
                conf = float(row['confidence'])
                cls_id = int(row['class'])
                cls_name = str(row['name']).strip().lower()
                
                # Verified class mapping:
                # 0: helmet (Compliant)
                # 1: no_helmet (Violation)
                if cls_id == 0 or "no" not in cls_name and "helmet" in cls_name:
                    standard_name = "helmet"
                    helmets_count += 1
                    is_violation = False
                else:
                    standard_name = "no_helmet"
                    violations_count += 1
                    is_violation = True
                    
                detections.append({
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2,
                    "confidence": round(conf * 100, 1),
                    "class_id": cls_id,
                    "class_name": standard_name,
                    "is_violation": is_violation
                })

        # Draw OpenCV bounding boxes on image
        annotated_img = image.copy()
        
        for det in detections:
            x1, y1, x2, y2 = det["x1"], det["y1"], det["x2"], det["y2"]
            conf = det["confidence"]
            is_violation = det["is_violation"]
            
            # Palette:
            # Helmet = Emerald Green BGR (129, 185, 16)
            # No Helmet = Crimson Red BGR (68, 68, 239)
            color = (68, 68, 239) if is_violation else (129, 185, 16)
            label = f"VIOLATION: NO HELMET {conf}%" if is_violation else f"HELMET {conf}%"
            
            # Draw box
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
            
            # Label background banner
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.55
            thickness = 1
            (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)
            
            box_y1 = max(0, y1 - text_h - 10)
            box_y2 = y1
            cv2.rectangle(annotated_img, (x1, box_y1), (x1 + text_w + 10, box_y2), color, -1)
            
            # Text inside banner
            cv2.putText(
                annotated_img, 
                label, 
                (x1 + 5, y1 - 5), 
                font, 
                font_scale, 
                (255, 255, 255), 
                thickness, 
                cv2.LINE_AA
            )

        # Compute elapsed time
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        # Save annotated image safely on Windows
        timestamp = int(time.time() * 1000)
        orig_filename = Path(image_path).name.replace(" ", "_")
        annotated_filename = f"annotated_{timestamp}_{orig_filename}"
        annotated_path = OUTPUTS_DIR / annotated_filename
        
        is_success, buffer = cv2.imencode(".jpg", annotated_img)
        if is_success:
            with open(annotated_path, "wb") as f:
                f.write(buffer)
        else:
            cv2.imwrite(str(annotated_path), annotated_img)

        # Compliance rate
        total_objects = helmets_count + violations_count
        compliance_rate = round((helmets_count / total_objects) * 100, 1) if total_objects > 0 else 0.0

        return {
            "annotated_path": f"/outputs/{annotated_filename}",
            "helmets_count": helmets_count,
            "violations_count": violations_count,
            "total_riders": total_objects,
            "compliance_rate": compliance_rate,
            "inference_time_ms": round(elapsed_ms, 1),
            "model_name": self.model_name,
            "detections": detections,
            "is_checkpoint_active": self.is_loaded
        }

# Global singleton detector instance
detector = HelmetDetector()
