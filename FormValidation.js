class Validation {
    constructor({rules = []}) {
        /* rules:
        [
            {
                message: '必填',
                validator: () => {
                    return _this.state.title.length > 0
                }
            }
        ]
        */
        return {
            dirty: false,
            valid: true,
            message: '',
            rules: rules
        }
    }
}

export class FormValidation {
    constructor(_this, params) {
        let form = {
            valid: false,
            submit() {
                let valid = true;
                for (let key of Object.keys(form)) {
                    const field = form[key];
                    if (field.validation) {
                        field.validate();
                        !field.validation.valid && (valid = false);
                    }
                }
                form.valid = valid;
            }
        };

        const validate = paramName => {
            if (form[paramName]) {
                const field = form[paramName];
                field.validation.dirty = true;
                if (field.validation.rules.length) {
                    let result = true;
                    let messages = [];
                    field.validation.rules.forEach(rule => {
                        if (!rule.validator(event)) {
                            result = false;
                            messages.push(rule.message);
                        }
                    });
                    field.validation.valid = result;
                    field.validation.message = messages.join(', ');
                }
                if (_this.forceUpdate) {
                    _this.forceUpdate();
                }
            }
        };

        for (let key of Object.keys(params)) {
            const param = params[key];
            let props = Object.assign({}, param.props);
            const handleNames = ['onChange', 'onSelect', 'onBlur', 'update'];
            handleNames.forEach(name => {
                param.props && param.props[name] && (props[name] = function (event) {
                    param.props[name](event);
                    // React
                    if (_this.setState) {
                        // cause set state is asyn
                        // so I set a Symbol state then I can use the callback to handle something
                        _this.setState({
                            _formValidation: Symbol('form')
                        }, () => {
                            validate(key);
                        });
                    }
                    else {
                        validate(key);
                    }
                });
            });

            const validation = new Validation(param.validation || {});

            form[key] = {
                props: props,
                validation: validation,
                validate: validate.bind(null, key)
            }
        }
        return form;
    }
}

export default FormValidation;
