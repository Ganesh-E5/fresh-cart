import { useCallback } from "react";

export function useFormSubmit(handleSubmit, clearErrors, onSubmit) {
    return useCallback(
        (e) => {
            clearErrors("server");
            return handleSubmit(onSubmit)(e);
        },
        [handleSubmit, clearErrors, onSubmit]
    )
}