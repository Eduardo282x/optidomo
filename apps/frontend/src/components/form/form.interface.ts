export interface DialogFormProps<T, Body> {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit: (data: Body) => void;
    data: T | null
}