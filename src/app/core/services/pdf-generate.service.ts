import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
//import { InvoiceSaveRequest } from 'src/app/checkout/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerateService {

  constructor() { }

  getInvoicePdf(data: any, customer: any) {
    let pdf = new jspdf('l', 'pt', 'a5');
    var source = this.getInvoicePdfSource(data);
    pdf.setFont('times');
    var startVertical = 15;

    pdf.setFontSize(10);
    pdf.setFontType('bold');

    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 10, "COCO CHIC SKIN CLINIC", 'center');

    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 14, "H.Shuwiz,", 'center');
    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 10, "Ameer Ahmed Magu,", 'center');
    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 10, "Male,", 'center');
    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 10, "Maldives 20096", 'center');

    pdf.text(pdf.internal.pageSize.width / 2, startVertical += 14, "+960 795-0077", 'center');

    pdf.text(40, startVertical += 16, `Invoice No : ${data.gvinvoiceNo}`);
    pdf.text(pdf.internal.pageSize.width / 2 + 30, startVertical, `Customer Name : ${customer.fullName}`);

    pdf.line(40, startVertical += 5, pdf.internal.pageSize.width - 40, startVertical);//line

    pdf.autoTable({//front page table
      theme: 'plain',
      styles: {
        valign: 'middle',
        fontSize: 9
      },
      rowPageBreak: 'avoid',
      startY: startVertical += 10,
      columnStyles: {
        0: { halign: 'left' },//detail
        1: { halign: 'right', columnWidth: 50 },//qty
        2: { halign: 'right', columnWidth: 120 },//Amount
      },
      margin: { left: 40, right: 40 },
      body: source,
      willDrawCell: function (data) {//using this function line can be drawn    
        if (data.section == 'body') {
          if (data.row.raw.length != 0 && data.row.raw[0].content == "Treatments")
            pdf.line(40, data.row.y, pdf.internal.pageSize.width - 40, data.row.y);//balance total line

          if (data.cell.raw.content == "Sub Amount")
            pdf.line(40, data.row.y + data.cell.height, data.cell.textPos.x + 5, data.row.y + data.cell.height);//line

          if (data.cell.raw.content == "Due Amount")
            pdf.line(40, data.row.y + data.cell.height, pdf.internal.pageSize.width - 40, data.row.y + data.cell.height);//line

        }
      },
      afterPageContent: function (data) {//adding page number
        //vertical lines
        pdf.line(data.table.pageStartX, data.table.pageStartY, data.table.pageStartX, data.cursor.y);
        var widthIncrese = 0;
        for (let index = 0; index < data.table.columns.length; index++) {//vertical line draw
          widthIncrese += data.table.columns[index].width;
          pdf.line(data.table.pageStartX + widthIncrese, data.table.pageStartY, data.table.pageStartX + widthIncrese, data.cursor.y);//(start x,start y,end x,end y)
        }
      }
    });
    window.open(pdf.output('bloburl'), '_blank');
  }

  getInvoicePdfSource(data: any) {
    var source = [];

    //tratements
    source.push(
      [
        { content: 'Treatments' },
        { content: 'Qty', styles: { halign: 'center' } },
        { content: 'Amount (MVR)', styles: { halign: 'center' } }
      ]
    );

    for (let index = 0; index < data.treatments.length; index++) {
      source.push(
        [
          { content: `${index + 1}.${data.treatments[index].treatmentName}` },//treatment name
          { content: `${data.treatments[index].quantity}` },//qty
          { content: `${data.treatments[index].amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }//amount
        ]
      );
    }
    source.push(
      [
        { content: 'Sub Amount', styles: { halign: 'right' } },
        { content: '' },
        { content: `${data.treatmentSubTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
      ]
    );
    //products
    source.push(
      [
        { content: 'Products' },
        { content: '' },
        { content: '' }
      ]
    );
    for (let index = 0; index < data.products.length; index++) {
      source.push(
        [
          { content: `${index + 1}.${data.products[index].productName}` },
          { content: `${data.products[index].quantity}` },
          { content: `${(data.products[index].price * data.products[index].quantity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
        ]
      );
    }
    source.push(
      [
        { content: 'Sub Amount', styles: { halign: 'right' } },
        { content: '' },
        { content: `${data.productSubTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
      ]
    );
    source.push(
      [
        { content: 'Discount', styles: { halign: 'right' } },
        { content: '' },
        { content: `${data.treatmentDiscountAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
      ]
    );
    source.push(
      [
        { content: 'Due Amount', styles: { halign: 'right' } },
        { content: '' },
        { content: `${(data.productSubTotal + data.treatmentSubTotal - data.treatmentDiscountAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}` }
      ]
    );

    return source;
  }
}

