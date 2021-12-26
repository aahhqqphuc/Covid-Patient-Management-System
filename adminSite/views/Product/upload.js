$("document").on("load", function () {
  console.log("input");
  $("#fileup").fileinput({
    maxFileCount: 2,
    enableResumableUpload: true,
    allowedFileTypes: ["image"],
    showCancel: true,
    initialPreviewAsData: true,
    overwriteInitial: false,
    // initialPreview: [],          // if you have previously uploaded preview files
    // initialPreviewConfig: [],    // if you have previously uploaded preview files
    dropZoneEnabled: false,
    autoReplace: false,
  });
});
