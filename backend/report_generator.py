import os
import sys
import csv
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from database.db import get_connection, get_statistics

BASE_DIR = Path(__file__).resolve().parent
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def generate_csv_report():
    """Generates an official CSV enforcement report from SQLite data."""
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"traffic_enforcement_report_{timestamp_str}.csv"
    filepath = REPORTS_DIR / filename
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, timestamp, filename, helmets_count, violations_count, 
               compliance_rate, inference_time_ms, model_name
        FROM detections
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Incident_ID", 
            "Timestamp", 
            "Filename", 
            "Helmets_Detected", 
            "Violations_Detected", 
            "Total_Riders",
            "Compliance_Rate_Percent", 
            "Inference_Time_ms", 
            "Model_Name",
            "Enforcement_Status"
        ])
        
        for r in rows:
            helmets = r["helmets_count"]
            violations = r["violations_count"]
            total = helmets + violations
            status = "CHALLAN_REQUIRED" if violations > 0 else "COMPLIANT"
            writer.writerow([
                r["id"],
                r["timestamp"],
                r["filename"],
                helmets,
                violations,
                total,
                f"{r['compliance_rate']}%",
                f"{round(r['inference_time_ms'], 1)}ms",
                r["model_name"],
                status
            ])
            
    return filepath, filename

def generate_pdf_report():
    """Generates an official styled Traffic Police PDF Dossier."""
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"traffic_police_dossier_{timestamp_str}.pdf"
    filepath = REPORTS_DIR / filename

    stats = get_statistics()
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, timestamp, filename, helmets_count, violations_count, 
               compliance_rate, inference_time_ms, model_name
        FROM detections
        ORDER BY id DESC
        LIMIT 25
    """)
    incidents = cursor.fetchall()
    conn.close()

    doc = SimpleDocTemplate(
        str(filepath), 
        pagesize=letter,
        rightMargin=36, 
        leftMargin=36, 
        topMargin=36, 
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_navy = colors.HexColor("#0B132B")
    c_blue = colors.HexColor("#1C2541")
    c_accent = colors.HexColor("#3A86FF")
    c_red = colors.HexColor("#D90429")
    c_green = colors.HexColor("#06D6A0")

    title_style = ParagraphStyle(
        'PoliceTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=c_navy,
        spaceAfter=6,
        alignment=1 # Center
    )

    subtitle_style = ParagraphStyle(
        'PoliceSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=14,
        alignment=1
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=c_blue,
        spaceBefore=10,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor("#2D3748")
    )

    elements = []

    # Header
    elements.append(Paragraph("TRAFFIC SURVEILLANCE & SAFETY ENFORCEMENT COMMAND", title_style))
    elements.append(Paragraph("Automated Deep Learning Helmet Compliance Audit Dossier", subtitle_style))
    elements.append(Spacer(1, 10))

    # Meta Table
    gen_time = datetime.now().strftime("%d %B %Y, %H:%M:%S")
    meta_data = [
        [
            Paragraph("<b>Issuing Authority:</b> Central Traffic Police HQ", body_style),
            Paragraph(f"<b>Audit Date:</b> {gen_time}", body_style)
        ],
        [
            Paragraph("<b>Supervising Officer:</b> Inspector R. Sharma (POL-4092)", body_style),
            Paragraph("<b>Primary DL Model:</b> YOLOv5s (mAP50: 75.40%)", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EDF2F7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 15))

    # Executive Summary Table
    elements.append(Paragraph("1. EXECUTIVE AUDIT SUMMARY", section_heading))
    total_imgs = stats["total_processed"]
    total_helmets = stats["total_helmets"]
    total_viol = stats["total_violations"]
    total_riders = stats["total_riders"]
    comp_rate = f"{stats['compliance_rate']}%"

    summary_data = [
        ["Total Snapshots", "Helmets Detected", "Violations Detected", "Riders Observed", "Compliance Rate"],
        [str(total_imgs), str(total_helmets), str(total_viol), str(total_riders), comp_rate]
    ]
    summary_table = Table(summary_data, colWidths=[108, 108, 108, 108, 108])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#F7FAFC")),
        ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,1), (-1,1), 12),
        ('TEXTCOLOR', (1,1), (1,1), c_green),
        ('TEXTCOLOR', (2,1), (2,1), c_red),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E0")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 15))

    # Incident Log Table
    elements.append(Paragraph("2. SURVEILLANCE INCIDENT AUDIT TRAIL", section_heading))
    incident_headers = ["ID", "Timestamp", "Frame Filename", "Helmets", "Violations", "Latency", "Action Required"]
    incident_rows = [incident_headers]

    for inc in incidents:
        has_v = inc["violations_count"] > 0
        action = "ISSUE CHALLAN" if has_v else "COMPLIANT"
        incident_rows.append([
            f"#{inc['id']}",
            inc["timestamp"][:16] if inc["timestamp"] else "N/A",
            inc["filename"][:22] if inc["filename"] else "snapshot.jpg",
            str(inc["helmets_count"]),
            str(inc["violations_count"]),
            f"{round(inc['inference_time_ms'])}ms",
            action
        ])

    if len(incident_rows) == 1:
        incident_rows.append(["-", "No incidents logged yet", "-", "-", "-", "-", "-"])

    inc_table = Table(incident_rows, colWidths=[35, 95, 150, 50, 55, 55, 100])
    inc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_blue),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('ALIGN', (2,1), (2,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(inc_table)
    elements.append(Spacer(1, 20))

    # Footer note
    footer_text = "CONFIDENTIAL - Official Traffic Police Documentation. Generated automatically by Smart Helmet AI Surveillance System."
    elements.append(Paragraph(footer_text, ParagraphStyle('Foot', parent=body_style, fontSize=7, textColor=colors.gray, alignment=1)))

    doc.build(elements)
    return filepath, filename
