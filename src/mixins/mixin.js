export const authenticationMessages = {
    methods: {
        showAuthenticationMessages(response) {
            let messages = [];

            let { status } = response;
            let type = null;

            status == 200 ? type = 'success' : type = 'error';

            let hasErrors = null;
            response.data.hasOwnProperty('errors') ? hasErrors = true : hasErrors = false;
            
            switch (hasErrors) {
                case false:
                    messages.push(
                        this.$toast.add({
                            severity: type,
                            summary: response.data.message,
                            detail: type,
                            life: 3000,
                        })
                    );
                    return messages;

                case true:
                    Object.keys(response.data.errors).forEach((key) => {
                        messages.push(
                            this.$toast.add({
                                severity: type,
                                summary: response.data.errors[key][0],
                                detail: key,
                                life: 3000,
                            })
                        );
                    });
                    return messages;
            }
        },
    },
};

export const setTableItems = {
    methods: {
        
    }
}