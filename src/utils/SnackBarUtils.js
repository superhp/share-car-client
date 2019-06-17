export const SnackbarVariants = [
    "success", "warning", "error", "info"
];

export const showSnackBar = (message, variant, context) => {
    context.setState({
        snackBarClicked: true,
        snackBarMessage: message,
        snackBarVariant: SnackbarVariants[variant]
    });
    setTimeout(
        function () {
            context.setState({ snackBarClicked: false });
        }.bind(context),
        3000
    );
}