from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = "output/pdf/transitops-person-2-fleet-driver-module.pdf"


def on_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(colors.HexColor("#0f172a"))
    canvas.rect(0, height - 0.48 * inch, width, 0.48 * inch, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.55 * inch, height - 0.31 * inch, "TransitOps - Person 2 Fleet & Driver Module")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(width - 0.55 * inch, 0.35 * inch, f"Page {doc.page}")
    canvas.restoreState()


def p(text, style):
    return Paragraph(text, style)


def bullets(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=12) for item in items],
        bulletType="bullet",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=7,
    )


def section(title, styles):
    return [Spacer(1, 10), Paragraph(title, styles["SectionTitle"]), Spacer(1, 5)]


def small_table(rows, widths):
    table = Table(rows, colWidths=widths, hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def build():
    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=A4,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.62 * inch,
        title="TransitOps Person 2 Fleet Driver Module",
        author="Akshay Yadav",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])

    base = getSampleStyleSheet()
    styles = {
        "Title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=29,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "Subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#475569"),
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "SectionTitle": ParagraphStyle(
            "SectionTitle",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#0f172a"),
            borderColor=colors.HexColor("#38bdf8"),
            borderWidth=0,
            borderPadding=0,
            spaceBefore=4,
            spaceAfter=3,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#1e293b"),
            alignment=TA_LEFT,
            spaceAfter=4,
        ),
        "Small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#334155"),
        ),
        "Code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor("#0f172a"),
            backColor=colors.HexColor("#f1f5f9"),
            borderPadding=4,
        ),
    }

    story = []
    story.append(Spacer(1, 0.45 * inch))
    story.append(p("TransitOps", styles["Title"]))
    story.append(
        p(
            "Smart Transport Operations Platform - Person 2 Fleet, Driver, and Compliance Module",
            styles["Subtitle"],
        )
    )
    story.append(
        small_table(
            [
                ["Owner", "Akshay Yadav - Person 2"],
                ["Hackathon", "Odoo Hackathon - 8 hour build window"],
                ["Branch", "feature/fleet-compliance"],
                ["Current repository folder", "transitops/"],
                ["Current detected stack", "Backend: Express + Mongoose. Frontend: React + Vite."],
                ["Document purpose", "Implementation scope, roadmap, integration contracts, and task checklist."],
            ],
            [1.55 * inch, 5.15 * inch],
        )
    )

    story += section("1. Person 2 Responsibility", styles)
    story.append(
        p(
            "Person 2 owns the complete Fleet & Driver Management module. Other team members should integrate through stable APIs and shared constants rather than editing this module directly.",
            styles["Body"],
        )
    )
    story.append(
        bullets(
            [
                "Vehicle Management: CRUD, details, search, filters, sorting, status badges, validation, and retirement.",
                "Driver Management: CRUD, profile, search, filters, safety score, license validation, and availability.",
                "Compliance Dashboard: total drivers, valid licenses, expired licenses, expiring soon licenses, average safety score, and suspended drivers.",
            ],
            styles["Body"],
        )
    )

    story += section("2. Current Team Foundation", styles)
    story.append(
        small_table(
            [
                ["Area", "Decision"],
                ["Backend", "Node.js, Express, Mongoose"],
                ["Frontend", "React, Vite"],
                ["API prefix", "/api"],
                ["Response shape", "{ success, message, data } or { success, message, errors }"],
                ["Shared constants", "transitops/backend/src/constants/enums.js"],
                ["Person 2 branch", "feature/fleet-compliance"],
            ],
            [1.8 * inch, 4.9 * inch],
        )
    )

    story += section("3. Vehicle Domain", styles)
    story.append(
        small_table(
            [
                ["Field", "Rules"],
                ["registrationNumber", "Required, unique, trimmed, uppercase, indexed"],
                ["name", "Required vehicle name"],
                ["model", "Optional model"],
                ["type", "Enum from shared vehicle types"],
                ["maximumLoadCapacity", "Required, must be greater than zero"],
                ["odometer", "Required, cannot be negative"],
                ["acquisitionCost", "Optional, cannot be negative"],
                ["region", "Optional operational region"],
                ["status", "Available, On Trip, In Shop, Retired"],
            ],
            [2.15 * inch, 4.55 * inch],
        )
    )

    story += section("4. Driver Domain", styles)
    story.append(
        small_table(
            [
                ["Field", "Rules"],
                ["name", "Required"],
                ["licenseNumber", "Required, unique, trimmed, uppercase, indexed"],
                ["licenseCategory", "Required"],
                ["licenseExpiryDate", "Required date"],
                ["contactNumber", "Required"],
                ["safetyScore", "Required, 0 to 100"],
                ["region", "Optional operational region"],
                ["status", "Available, On Trip, Off Duty, Suspended"],
            ],
            [2.15 * inch, 4.55 * inch],
        )
    )

    story += section("5. Business Rules", styles)
    story.append(
        bullets(
            [
                "A vehicle can be dispatched only when its status is Available.",
                "Vehicles with status On Trip, In Shop, or Retired must not appear in dispatch availability lists.",
                "A driver can be dispatched only when status is Available and licenseExpiryDate is today or in the future.",
                "Drivers with status On Trip, Off Duty, or Suspended must not appear in dispatch availability lists.",
                "Expired license drivers must not appear in dispatch availability lists even if their status says Available.",
                "Duplicate registration numbers and duplicate license numbers must be rejected case-insensitively.",
            ],
            styles["Body"],
        )
    )

    story += section("6. Required API Contract", styles)
    story.append(
        small_table(
            [
                ["Method", "Endpoint", "Purpose"],
                ["GET", "/api/vehicles", "List/search/filter/sort/paginate vehicles"],
                ["POST", "/api/vehicles", "Create vehicle"],
                ["GET", "/api/vehicles/:id", "Vehicle details"],
                ["PUT", "/api/vehicles/:id", "Update vehicle"],
                ["DELETE", "/api/vehicles/:id", "Retire or delete vehicle per final team decision"],
                ["GET", "/api/vehicles/available", "Dispatch-safe vehicle list for Person 3"],
                ["GET", "/api/drivers", "List/search/filter/sort/paginate drivers"],
                ["POST", "/api/drivers", "Create driver"],
                ["GET", "/api/drivers/:id", "Driver profile"],
                ["PUT", "/api/drivers/:id", "Update driver"],
                ["DELETE", "/api/drivers/:id", "Delete or deactivate driver per final team decision"],
                ["GET", "/api/drivers/available", "Dispatch-safe driver list for Person 3"],
                ["GET", "/api/compliance/drivers", "Compliance dashboard metrics"],
            ],
            [0.7 * inch, 2.25 * inch, 3.75 * inch],
        )
    )

    story.append(PageBreak())

    story += section("7. Backend Files For Person 2", styles)
    story.append(
        p(
            "The following backend files are the intended Person 2 ownership area. Existing shared route and constant files may be touched only to mount routes or add shared enum values.",
            styles["Body"],
        )
    )
    story.append(
        p(
            "backend/src/models/Vehicle.js<br/>"
            "backend/src/models/Driver.js<br/>"
            "backend/src/validators/vehicleValidator.js<br/>"
            "backend/src/validators/driverValidator.js<br/>"
            "backend/src/repositories/vehicleRepository.js<br/>"
            "backend/src/repositories/driverRepository.js<br/>"
            "backend/src/services/vehicleService.js<br/>"
            "backend/src/services/driverService.js<br/>"
            "backend/src/services/complianceService.js<br/>"
            "backend/src/controllers/vehicleController.js<br/>"
            "backend/src/controllers/driverController.js<br/>"
            "backend/src/controllers/complianceController.js<br/>"
            "backend/src/routes/vehicle.routes.js<br/>"
            "backend/src/routes/driver.routes.js<br/>"
            "backend/src/routes/compliance.routes.js",
            styles["Code"],
        )
    )

    story += section("8. Frontend Files For Person 2", styles)
    story.append(
        p(
            "frontend/src/features/fleet/vehicles<br/>"
            "frontend/src/features/fleet/drivers<br/>"
            "frontend/src/features/fleet/compliance<br/>"
            "frontend/src/components/common",
            styles["Code"],
        )
    )

    story += section("9. Task Checklist", styles)
    checklist = [
        ["Task", "Status", "Notes"],
        ["1", "Completed", "Inspected initial workspace and found it empty."],
        ["2", "Superseded", "Initial local scaffold was created, then excluded after syncing Person 1 repo."],
        ["3", "Completed and pushed", "Added Person 2 module folders and task map on feature/fleet-compliance."],
        ["4", "Next", "Add Vehicle and Driver Mongoose models."],
        ["5", "Next", "Add validation helpers."],
        ["6", "Next", "Add repositories for database access."],
        ["7", "Next", "Add services with business rules."],
        ["8", "Next", "Add controllers."],
        ["9", "Next", "Add routes and mount them under /api."],
        ["10", "Next", "Add compliance service and endpoint."],
        ["11", "Next", "Add backend tests."],
        ["12", "Next", "Add frontend API functions and UI pages."],
    ]
    story.append(small_table(checklist, [0.65 * inch, 1.45 * inch, 4.6 * inch]))

    story += section("10. Git And Team Safety Rules", styles)
    story.append(
        bullets(
            [
                "Work on branch feature/fleet-compliance.",
                "Before starting a task, run git fetch origin and confirm branch status.",
                "Commit only Person 2 files unless route mounting or shared constants are required.",
                "Avoid git add . because old local root-level scaffold exists outside transitops/.",
                "Use focused commits such as feat(fleet): add vehicle and driver models.",
                "Do not edit Person 1 auth/dashboard files, Person 3 trip/maintenance files, or Person 4 finance/report files.",
            ],
            styles["Body"],
        )
    )

    story += section("11. Integration Points", styles)
    story.append(
        small_table(
            [
                ["Team member", "Needs from Person 2"],
                ["Person 1", "Fleet summary metrics for dashboard and RBAC route protection alignment."],
                ["Person 3", "GET /api/vehicles/available and GET /api/drivers/available for dispatch."],
                ["Person 4", "Vehicle and driver lists/details for fuel logs, expenses, and reports."],
            ],
            [1.4 * inch, 5.3 * inch],
        )
    )

    story += section("12. Edge Cases To Cover", styles)
    story.append(
        bullets(
            [
                "Registration numbers and license numbers should be unique after trimming and uppercase normalization.",
                "Invalid enum values should return validation errors.",
                "Capacity zero or negative must be rejected.",
                "Negative odometer and negative acquisition cost must be rejected.",
                "License expiry today should be considered valid until the day ends.",
                "Expired license drivers should be excluded from available driver endpoint.",
                "Pagination should handle empty results and out-of-range pages gracefully.",
            ],
            styles["Body"],
        )
    )

    story += section("13. Final Deliverable Standard", styles)
    story.append(
        p(
            "Person 2 delivery is complete when vehicle CRUD, driver CRUD, available vehicle/driver APIs, compliance metrics, validations, business rules, frontend management pages, and basic tests are working on feature/fleet-compliance without modifying unrelated team modules.",
            styles["Body"],
        )
    )

    doc.build(story)


if __name__ == "__main__":
    build()
