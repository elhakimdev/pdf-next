import { TextBlock } from "~/lib/pdf/elements/text-block";
import { PdfReportDocument } from "~/lib/pdf/core/document";
import { fontsRegistry } from "~/lib/pdf/core/fonts";
import { mmToPt } from "~/lib/pdf/utilities/converter";

export class UserReport extends PdfReportDocument<any> {
  override async define(): Promise<any> {
    const robotoBold = fontsRegistry.getFont({
      family: "Roboto", 
      weight: "bold",
      italic: false
    });
    const robotoRegularItalic = fontsRegistry.getFont({
      family: "Roboto", 
      weight: "",
      italic: true
    });
    const robotoCondensed = fontsRegistry.getFont({
      family: "Roboto", 
      weight: "condensed",
      italic: false
    });
    const robotoSemibold = fontsRegistry.getFont({
      family: "Roboto", 
      weight: "SemiBold",
      italic: false
    });

    this.elements.push(
      // Brand Header - left aligned, big size, left
      new TextBlock("Stellar Pte Ltd", { size: 18, y: 10, lineHeights: 0.5, align: "left", fonts: robotoBold }),
      new TextBlock("438 Alexandra Road", { size: 8, lineHeights: 1.2, align: "left", fonts: robotoCondensed }),
      new TextBlock("#13-03 Alexandra Point", { size: 8, lineHeights: 1.2, align: "left", fonts: robotoCondensed }),
      new TextBlock("Singapore 119958", { size: 8, lineHeights: 1.2, align: "left", fonts: robotoCondensed }),
      new TextBlock("Phone: +65 6559 1668", { size: 8, lineHeights: 1.2, align: "left", fonts: robotoCondensed }),
      new TextBlock("Email: shipmgt@stellar.com.sg", { size: 8, lineHeights: 1.2, align: "left", fonts: robotoSemibold }),

      new TextBlock("", {lineHeights: 10}),

      new TextBlock("Purchase Orders", {  position: "absolute", align: "right", size: 18, lineHeights: 0.5, fonts: robotoBold, y: 803.5433070866142, }),
      new TextBlock("Account No: 1 45555 79000 28989", {  position: "absolute", align: "right", size: 8, lineHeights: 1.2, fonts: robotoCondensed, y: 794.5433070866142, }),
      new TextBlock("Stmt Period: June 01, 2025", {  position: "absolute", align: "right", size: 8, lineHeights: 1.2, fonts: robotoCondensed, y: 784.9433070866141, }),
      new TextBlock("Effective Date: June 09, 2025", {  position: "absolute", align: "right", size: 8, lineHeights: 1.2, fonts: robotoCondensed, y: 775.3433070866141, }),
      new TextBlock("Signer: off", {  position: "absolute", align: "right", size: 8, lineHeights: 1.2, fonts: robotoCondensed, y: 765.7433070866141, }),
      new TextBlock("Required Payouts: false", {  position: "absolute", align: "right", size: 8, lineHeights: 1.2, fonts: robotoCondensed, y: 756.1433070866141, }),
    )

    console.log({
      pageHeight: this.page?.getHeight(),
      pageWidth: this.page?.getWidth(),
      position: this.page?.getPosition(),
    })

    const margin = this.configs?.page?.margin ?? 20;

    this.page?.drawLine({
      start: {  
        x:  0 + (mmToPt(margin)/2),
        y: 750.1433070866141,
      },
      end: {
        x: this.page.getWidth() - (margin*2),
        y: 750.1433070866141,
      },
      lineCap: 1,
      thickness: 0.5,
      opacity: 0.7
    })
  }
}