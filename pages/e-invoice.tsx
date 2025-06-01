import { PDFDocument } from "pdf-lib"
import { Button } from "~/components/ui/button"
import { printPdf } from "~/lib/pdf/utilities/previewer"
import { UserReport } from "~/models/report/user.report"

export default defineNuxtComponent({
  setup(){
    const handleClick =  async (type: "print" | "download") => { 
      const res = await fetch("/api/report/e-invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (type === "download") {
        const a = document.createElement("a");
        a.href = url;
        a.download = "e-Invoice_" + Date.UTC + ".pdf";
        a.click();
      } else {
        const win = window.open(url, "_blank");
        win?.focus();
      }

      URL.revokeObjectURL(url);
    }
    return {
      handleClick
    }
  },
  render(){
    const {
      handleClick
    } = this;
    return(
      <div class="w-full h-screen text-gray-700 p-6">
        <div class="flex w-full border rounded p-6 flex-col gap-y-3">
          <div>
            To Print Invoice, Use this buttn bellow!
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
          </div>
        </div>
      </div>
    )
  }
})