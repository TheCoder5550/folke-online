import Modal, { type ModalProps } from "../Modal/Modal";

export default function ReportModal(props: ModalProps) {
  const mail = import.meta.env.VITE_SUPPORT_MAIL;
  const subject = "Report bug";
  const link = `mailto:${mail}?subject=${encodeURIComponent(subject)}`;

  return (
    <Modal {...props}>
      <h2>Report bug</h2>

      <p>Send an email to <a href={link}>{mail}</a> if you find a bug, got an incorrectly validated proof, or if you don't understand something.</p>

      <span>Please include the following:</span>
      <ol>
        <li>A detailed description on what is incorrect/what the bug is.</li>
        <li>What you think the correct behaviour should be.</li>
        <li>Where you found the error. Include the url of the page with the error and what you did to trigger the error.</li>
      </ol>

      <span>Thanks,<br />The Folke Team</span>
    </Modal>
  )
}