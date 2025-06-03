import { Button } from "~/components/ui/button"
import { PDFDocument } from "~/lib/pdf-next/src/core/PDFDocument";
import { PDFTextElement } from "~/lib/pdf-next/src/elements/PDFTextElement";
import { PageOrientation } from "~/lib/pdf-next/src/types/core/PDFPage";
import { PDFDocument as PDFLibEngine } from "pdf-lib";
import { PDFLibRenderer } from "~/lib/pdf-next/src/renderer/drivers/PDFLibRenderer";
import { PDFEngineContext } from "~/lib/pdf-next/src/core/contexts/PDFEngineContext";

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
      e.preventDefault();


      const doc = new PDFDocument(595, 842, PageOrientation.Portrait, { top: 40, right: 40, bottom: 40, left: 40 }); // A4 size

      doc.addElement(
        new PDFTextElement(
          "Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri.", {
            fontSize: 10,
            color: "#333333",
            textAlign: "right",
            fontFamily: undefined, // pakai default
            lineHeight: 18,
            margin: 20
          }
        )
      )
      doc.addElement(
        new PDFTextElement(
          "Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri.", {
            fontSize: 10,
            color: "#333333",
            textAlign: "center",
            fontFamily: undefined, // pakai default
            lineHeight: 18,
            margin: 0
          }
        )
      )
      doc.addElement(
        new PDFTextElement(
          "Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri. Ini adalah contoh teks yang cukup panjang untuk dibungkus dan di-justify pada halaman PDF. PDFLibRenderer akan memecah kalimat ini menjadi beberapa baris yang rapi dan rata kanan-kiri.", {
            fontSize: 10,
            color: "#333333",
            textAlign: "justify",
            fontFamily: undefined, // pakai default
            lineHeight: 18,
            margin: 0
          }
        )
      )
      
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