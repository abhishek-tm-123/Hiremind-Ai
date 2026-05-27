declare module "pdf-parse-fixed" {
  interface PDFParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFParseResult>;

  export default pdfParse;
}
