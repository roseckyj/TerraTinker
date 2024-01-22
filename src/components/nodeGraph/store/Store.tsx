import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { getDefaultLayer } from "../../../data/getDefaultGeneratorData";
import { Layer } from "../../../types/layerTypes";

export interface IStoreProps {
    onCancel: () => void;
    onCreate: (layer: Layer) => void;
    isOpen: boolean;
}

export function Store({ isOpen, onCancel, onCreate }: IStoreProps) {
    return (
        <Modal onClose={onCancel} size="xl" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent color="whiteAlpha.900">
                <ModalHeader>Browse templates</ModalHeader>
                <ModalCloseButton />
                <ModalBody>Store will be here... Some time</ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        onClick={() => onCreate(getDefaultLayer())}
                        mr={4}
                    >
                        Create default
                    </Button>
                    <Button onClick={onCancel}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
