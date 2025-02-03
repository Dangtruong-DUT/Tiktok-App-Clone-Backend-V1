import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cx = classNames.bind(styles);

function Modal({ children, onClose }) {
  const handleOverlayClick = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className={cx("modal")}>
      <div className={cx("modal__overlay")} onClick={handleOverlayClick}></div>
      <div className={cx("modal__content")}>{children}</div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};
export default Modal;
