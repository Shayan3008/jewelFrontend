export const showDialog = (dialog, message, isError) => ({
    type: actionNamesDialog.showDialog,
    dialog: dialog,
    message: message,
    isError: isError
});


export const actionNamesDialog = {
    showDialog: 'SHOW_DIALOG'
}