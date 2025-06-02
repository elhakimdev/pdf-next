import { Button } from "~/components/ui/button"
import { PDFDocument } from "~/lib/pdf-next/src/core/PDFDocument";
import { PDFTextElement } from "~/lib/pdf-next/src/elements/PDFTextElement";
import { PDFLibRenderer } from "~/lib/pdf-next/src/renderers/PDFLibRenderer";
import { PageOrientation } from "~/lib/pdf-next/src/types/core/PDFPage";
import { PDFDocument as PDFLibEngine } from "pdf-lib";

export default defineNuxtComponent({
  setup(){
    const handleClick =  async (type: "print" | "download") => { 
      const res = await fetch("/api/report/e-invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const date = new Date();

      if (type === "download") {
        const a = document.createElement("a");
        a.href = url;
        a.download = date.getTime()  + ".pdf";
        a.click();
      } else {
        const win = window.open(url, "_blank");
        win?.focus();
      }

      URL.revokeObjectURL(url);
    }
    const handleClickTest = async (e: Event) => {
      // console.log(e)
      e.preventDefault();


      const doc = new PDFDocument(595, 842, PageOrientation.Portrait, { top: 40, right: 40, bottom: 40, left: 40 }); // A4 size

      const text = new PDFTextElement(
        "Hello, this is a long paragraph of text to render.",
        {
          width: 400,
          fontSize: 14,
          lineHeight: 1.5,
          fontFamily: "Helvetica",
          margin: 10,
        }
      );
      const textA = new PDFTextElement(
        "Hello, this is a long paragraph of text to render. Loremafkdbkfbdskjfkjdsbkjfbdskf lsndfjdskjfkdj",
        {
          width: 400,
          fontSize: 14,
          lineHeight: 1.5,
          fontFamily: "Helvetica",
          margin: 10,
        }
      );

      doc.addElement(text);
      doc.addElement(textA);

      console.log(doc.getPages());
      const enginer = await PDFLibEngine.create();
      const renderer = new PDFLibRenderer(doc, enginer);
      await renderer.render();
      const pdfBytes = await renderer.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      win?.focus();
    }
    return {
      handleClick,
      handleClickTest,
    }
  },
  render(){
    const {
      handleClick,
      handleClickTest
    } = this;
    return(
      <div class="w-full h-screen text-gray-700 p-6">
        <div class="flex w-full border rounded p-6 flex-col gap-y-3">
          <div>
            To Print Invoice, Use this button bellow!
          </div>
          <div class="flex flex-row gap-x-3">
            <Button class={["hover:cursor-pointer"]} asChild>
              <button onClick={(e) => handleClick("print")}>
                Print
              </button>
            </Button>
            <Button class={["hover:cursor-pointer"]} asChild>
              <button onClick={(e) => handleClick("download")}>
                Download
              </button>
            </Button>
            <Button class={["hover:cursor-pointer"]} asChild>
              <button onClick={(e) => handleClickTest(e)}>
                Test New Utils
              </button>
            </Button>
          </div>
        </div>
      </div>
    )
  }
})