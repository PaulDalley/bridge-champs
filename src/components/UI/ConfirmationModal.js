import React from 'react';
import { Modal, Button, Icon } from 'react-materialize';

const ConfirmationModal = ({ headerText, bodyText, buttonText, color, icon, confirmationHandler }) => {
    return (
        <Modal
            id={`ConfirmationModal-${headerText.slice(0,5)}`}
            header={headerText}>
            {bodyText}
            <Button className="CreateArticle-delete"
                    onClick={(e) => confirmationHandler(e)}
                    waves='light'
                    style={{ color }}
                >{buttonText}

                <Icon left>{icon}</Icon>
            </Button>
        </Modal>
    );
};

export default ConfirmationModal;