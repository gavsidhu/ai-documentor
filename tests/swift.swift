func presentStep2(emailSupportFilter: String, fromViewController: UIViewController) {
  let submitWithLogTitle = NSLocalizedString("CONTACT_SUPPORT_SUBMIT_WITH_LOG", comment: "Button text")
  let cancelTitle = NSLocalizedString("CANCEL", comment: "Button text")
  let emailRequest = SupportEmailModel(supportFilter: emailSupportFilter, debugLogPolicy: .requireUpload)
  
  let operation = ComposeSupportEmailOperation(model: emailRequest)
  let modal = ModalActivityIndicatorViewController()

  let onCancel = { [weak modal] in
    modal?.dismiss()
    operation.cancel()
  }

  let onSuccess = { [weak modal] in
    modal?.dismiss()
  }

  let onError = { [weak fromViewController] error in
    guard let strongVC = fromViewController else { return }
    if error.isCancelled { return }
    showError(error, emailSupportFilter: emailSupportFilter, fromViewController: strongVC)
  }

  modal.present(fromViewController: fromViewController, canCancel: true, onCancel: onCancel)

  operation.perform(on: DispatchQueue.sharedUserInitiated)
    .done(onSuccess)
    .ensure { [weak modal] in
      modal?.dismiss()
    }
    .catch(onError)
}