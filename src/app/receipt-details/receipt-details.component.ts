import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ReceptDetailsService } from '../services/receptDetails/recept-details.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-receipt-details',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './receipt-details.component.html',
  styleUrl: './receipt-details.component.scss'
})
export class ReceiptDetailsComponent {
  visible: boolean = false;
  userRole:any
  userID:any
  receiptData:any
  constructor(private http:ReceptDetailsService){}

  ngOnInit(){
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getReceptData();
  }
  showDialog() {
    this.visible = true;
}

  getReceptData(){
    this.http.getReciptDetails(this.userID,this.userRole).subscribe({
      next:(res:any)=>{
        this.receiptData = res.receiptData
      },
      error:(err:any)=>{

      }
    })
  }



  generatePDF(receipt: any) {

      const doc = new jsPDF();

      // Page margins
      const margins = { top: 15, bottom: 15, left: 20, right: 20 };
      const lineHeight = 10;
      let currentY = margins.top;
      const vmrdaLogoBase64 = '../../assets/vmrda_logo_image.png'; // Add your logo path or base64 string
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
      doc.addImage(vmrdaLogoBase64, 'PNG', logoX, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 5;

      // Drawing the border
      doc.setLineWidth(0.5);
      doc.rect(margins.left - 5, margins.top - 5, doc.internal.pageSize.width - (margins.left + margins.right - 10), doc.internal.pageSize.height - (margins.top + margins.bottom - 10));

      // Heading
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
      currentY += lineHeight + 2;

      // Subheading
      doc.setFontSize(12);
      doc.text('Receipt', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
      currentY += lineHeight * 1;

      // Adding date and receipt reference
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text(`Receipt No: ${receipt.ReceiptNo}`, margins.left, currentY);
      doc.text(`Date: ${currentDate}`, doc.internal.pageSize.width - margins.right - 45, currentY);
      currentY += lineHeight * 2;

      // Dynamic content based on receipt data
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text(`Property Code: ${receipt.Property}`, margins.left, currentY);
      currentY += lineHeight * 1;

      doc.setFont('times', 'normal');
      doc.text(
        `This receipt acknowledges the payment made for the property with code ${receipt.Property}, leased to ${receipt.User}. ` +
        `The payment includes the monthly lease amount, GST, and other applicable charges. Below is the summary of the payment details:`,
        margins.left,
        currentY,
        { maxWidth: doc.internal.pageSize.width - margins.left - margins.right }
      );
      currentY += lineHeight * 3;

      // Receipt details in table form
      // const tableColumn = ["Field", "Value"];
      const tableRows = [
        ["Receipt No", receipt.ReceiptNo],
        ["User ID", receipt.User],
        ["Bill No", receipt.BillNo],
        ["Property Code", receipt.Property],
        ["Paid Date", receipt.paid_date],
        ["Lease Amount", receipt.Rental_lease_amount_permonth],
        ["GST", receipt.GST],
        ["Total Rent Interest", receipt.Total_rental_interest],
        ["Total Paid", receipt.TotalPaid],
        ["Due Amount", receipt.Due],
        ["Payment Status", receipt.Status]
      ];

      const tableStartY = currentY + 7;

      // Using autoTable for structured receipt details
      autoTable(doc, {
        // head: [tableColumn],
        body: tableRows,
        startY: tableStartY,
        margin: { left: margins.left + 10, right: margins.right + 10 },
        tableWidth: doc.internal.pageSize.width - margins.left - margins.right - 20,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255]
        },
      });

      // Update currentY to the position after the table
      currentY = doc.internal.pageSize.height - margins.bottom - 20;

      // Footer content
      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      doc.text('Thank you for your payment. Please retain this receipt for your records.', margins.left, currentY);
      currentY += lineHeight * 1;

      doc.text('Regards,', margins.left, currentY);
      currentY += lineHeight;
      doc.text('VISAKHAPATNAM METROPOLITAN REGION DEVELOPMENT AUTHORITY', margins.left, currentY);

      // Save the PDF
      doc.save(`Receipt_${receipt.ReceiptNo}.pdf`);
    }



}
