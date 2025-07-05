import { createSignal as createSignal$1, mergeProps, untrack, batch, createEffect, onCleanup, createMemo, splitProps, Show, on } from 'solid-js';
import { ssrElement, mergeProps as mergeProps$1, ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import clsx from 'clsx';
import { makePersisted } from '@solid-primitives/storage';
import { createStore } from 'solid-js/store';

function createSignal(value) {
    const [get, set] = createSignal$1(value);
    return { get, set };
}

/**
 * Creates and returns the store of the form.
 *
 * @param options The form options.
 *
 * @returns The reactive store.
 */
function createFormStore({ initialValues = {}, validateOn = 'submit', revalidateOn = 'input', validate, } = {}) {
    // Create signals of form store
    const fieldNames = createSignal([]);
    const fieldArrayNames = createSignal([]);
    const element = createSignal();
    const submitCount = createSignal(0);
    const submitting = createSignal(false);
    const submitted = createSignal(false);
    const validating = createSignal(false);
    const touched = createSignal(false);
    const dirty = createSignal(false);
    const invalid = createSignal(false);
    const response = createSignal({});
    // Return form functions and state
    return {
        internal: {
            // Props
            initialValues,
            validate,
            validateOn,
            revalidateOn,
            // Signals
            fieldNames,
            fieldArrayNames,
            element,
            submitCount,
            submitting,
            submitted,
            validating,
            touched,
            dirty,
            invalid,
            response,
            // Stores
            fields: {},
            fieldArrays: {},
            // Other
            validators: new Set(),
        },
        get element() {
            return element.get();
        },
        get submitCount() {
            return submitCount.get();
        },
        get submitting() {
            return submitting.get();
        },
        get submitted() {
            return submitted.get();
        },
        get validating() {
            return validating.get();
        },
        get touched() {
            return touched.get();
        },
        get dirty() {
            return dirty.get();
        },
        get invalid() {
            return invalid.get();
        },
        get response() {
            return response.get();
        },
    };
}

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
function createForm(options) {
    // Create form store
    const form = createFormStore(options);
    // Return form store and linked components
    return [
        form,
        {
            Form: (props
            // eslint-disable-next-line solid/reactivity
            ) => Form(mergeProps({ of: form }, props)),
            Field: (props) => Field(
            // eslint-disable-next-line solid/reactivity
            mergeProps({ of: form }, props)),
            FieldArray: (props
            // eslint-disable-next-line solid/reactivity
            ) => FieldArray(mergeProps({ of: form }, props)),
        },
    ];
}

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 * @param field The store of the field.
 * @param type The data type to capture.
 *
 * @returns The element input.
 */
function getElementInput(element, field, type) {
    const { checked, files, options, value, valueAsDate, valueAsNumber } = element;
    return untrack(() => !type || type === 'string'
        ? value
        : type === 'string[]'
            ? options
                ? [...options]
                    .filter((e) => e.selected && !e.disabled)
                    .map((e) => e.value)
                : checked
                    ? [...(field.value.get() || []), value]
                    : (field.value.get() || []).filter((v) => v !== value)
            : type === 'number'
                ? valueAsNumber
                : type === 'boolean'
                    ? checked
                    : type === 'File' && files
                        ? files[0]
                        : type === 'File[]' && files
                            ? [...files]
                            : type === 'Date' && valueAsDate
                                ? valueAsDate
                                : field.value.get());
}

/**
 * Returns a tuple with all field and field array stores of a form.
 *
 * @param form The form of the stores.
 *
 * @returns The store tuple.
 */
function getFieldAndArrayStores(form) {
    return [
        ...Object.values(form.internal.fields),
        ...Object.values(form.internal.fieldArrays),
    ];
}

/**
 * Returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The reactive store.
 */
function getFieldArrayStore(form, name) {
    return form.internal.fieldArrays[name];
}

/**
 * Returns the index of the path in the field array.
 *
 * @param name The name of the field array.
 * @param path The path to get the index from.
 *
 * @returns The field index in the array.
 */
function getPathIndex(name, path) {
    return +path.replace(`${name}.`, '').split('.')[0];
}

/**
 * Removes invalid field or field array names of field arrays.
 *
 * @param form The form of the field array.
 * @param names The names to be filtered.
 */
function removeInvalidNames(form, names) {
    getFieldArrayNames(form, false).forEach((fieldArrayName) => {
        const lastIndex = untrack(getFieldArrayStore(form, fieldArrayName).items.get).length - 1;
        names
            .filter((name) => name.startsWith(`${fieldArrayName}.`) &&
            getPathIndex(fieldArrayName, name) > lastIndex)
            .forEach((name) => {
            names.splice(names.indexOf(name), 1);
        });
    });
}

/**
 * Returns a list with the names of all field arrays.
 *
 * @param form The form of the field arrays.
 * @param shouldValid Whether to be valid.
 *
 * @returns All field array names of the form.
 */
function getFieldArrayNames(form, shouldValid = true) {
    // Get name of every field array
    const fieldArrayNames = [...untrack(form.internal.fieldArrayNames.get)];
    // Remove invalid field array names
    if (shouldValid) {
        removeInvalidNames(form, fieldArrayNames);
    }
    // Return field array names
    return fieldArrayNames;
}

/**
 * Returns a list with the names of all fields.
 *
 * @param form The form of the fields.
 * @param shouldValid Whether to be valid.
 *
 * @returns All field names of the form.
 */
function getFieldNames(form, shouldValid = true) {
    // Get name of every field
    const fieldNames = [...untrack(form.internal.fieldNames.get)];
    // Remove invalid field names
    if (shouldValid) {
        removeInvalidNames(form, fieldNames);
    }
    // Return field names
    return fieldNames;
}

/**
 * Returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The reactive store.
 */
function getFieldStore(form, name) {
    return form.internal.fields[name];
}

/**
 * Returns a tuple with filtered field and field array names. For each
 * specified field array name, the names of the contained fields and field
 * arrays are also returned. If no name is specified, the name of each field
 * and field array of the form is returned.
 *
 * @param form The form of the fields.
 * @param arg2 The name of the fields.
 * @param shouldValid Whether to be valid.
 *
 * @returns A tuple with filtered names.
 */
function getFilteredNames(form, arg2, shouldValid) {
    return untrack(() => {
        // Get all field and field array names of form
        const allFieldNames = getFieldNames(form, shouldValid);
        const allFieldArrayNames = getFieldArrayNames(form, shouldValid);
        // If names are specified, filter and return them
        if (typeof arg2 === 'string' || Array.isArray(arg2)) {
            return (typeof arg2 === 'string' ? [arg2] : arg2)
                .reduce((tuple, name) => {
                // Destructure tuple
                const [fieldNames, fieldArrayNames] = tuple;
                // If it is name of a field array, add it and name of each field
                // and field array it contains to field and field array names
                if (allFieldArrayNames.includes(name)) {
                    allFieldArrayNames.forEach((fieldArrayName) => {
                        if (fieldArrayName.startsWith(name)) {
                            fieldArrayNames.add(fieldArrayName);
                        }
                    });
                    allFieldNames.forEach((fieldName) => {
                        if (fieldName.startsWith(name)) {
                            fieldNames.add(fieldName);
                        }
                    });
                    // If it is name of a field, add it to field name set
                }
                else {
                    fieldNames.add(name);
                }
                // Return tuple
                return tuple;
            }, [new Set(), new Set()])
                .map((set) => [...set]);
        }
        // Otherwise return every field and field array name
        return [allFieldNames, allFieldArrayNames];
    });
}

/**
 * Filters the options object from the arguments and returns it.
 *
 * @param arg1 Maybe the options object.
 * @param arg2 Maybe the options object.
 *
 * @returns The options object.
 */
function getOptions(arg1, arg2) {
    return (typeof arg1 !== 'string' && !Array.isArray(arg1) ? arg1 : arg2) || {};
}

function getPathValue(path, object) {
    return path.split('.').reduce((value, key) => value?.[key], object);
}

// Create counter variable
let counter = 0;
/**
 * Returns a unique ID counting up from zero.
 *
 * @returns A unique ID.
 */
function getUniqueId() {
    return counter++;
}

/**
 * Returns whether the field is dirty.
 *
 * @param startValue The start value.
 * @param currentValue The current value.
 *
 * @returns Whether is dirty.
 */
function isFieldDirty(startValue, currentValue) {
    const toValue = (item) => item instanceof Blob ? item.size : item;
    return Array.isArray(startValue) && Array.isArray(currentValue)
        ? startValue.map(toValue).join() !== currentValue.map(toValue).join()
        : startValue instanceof Date && currentValue instanceof Date
            ? startValue.getTime() !== currentValue.getTime()
            : Number.isNaN(startValue) && Number.isNaN(currentValue)
                ? false
                : startValue !== currentValue;
}

/**
 * Updates the dirty state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether dirty state is true.
 */
function updateFormDirty(form, dirty) {
    untrack(() => form.internal.dirty.set(dirty ||
        getFieldAndArrayStores(form).some((fieldOrFieldArray) => fieldOrFieldArray.active.get() && fieldOrFieldArray.dirty.get())));
}

/**
 * Updates the dirty state of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 */
function updateFieldDirty(form, field) {
    untrack(() => {
        // Check if field is dirty
        const dirty = isFieldDirty(field.startValue.get(), field.value.get());
        // Update dirty state of field if necessary
        if (dirty !== field.dirty.get()) {
            batch(() => {
                field.dirty.set(dirty);
                // Update dirty state of form
                updateFormDirty(form, dirty);
            });
        }
    });
}

/**
 * Validates a field or field array only if required.
 *
 * @param form The form of the field or field array.
 * @param fieldOrFieldArray The store of the field or field array.
 * @param name The name of the field or field array.
 * @param options The validate options.
 */
function validateIfRequired(form, fieldOrFieldArray, name, { on: modes, shouldFocus = false }) {
    untrack(() => {
        if (modes.includes((form.internal.validateOn === 'submit'
            ? form.internal.submitted.get()
            : fieldOrFieldArray.error.get())
            ? form.internal.revalidateOn
            : form.internal.validateOn)) {
            validate(form, name, { shouldFocus });
        }
    });
}

/**
 * Handles the input, change and blur event of a field.
 *
 * @param form The form of the field.
 * @param field The store of the field.
 * @param name The name of the field.
 * @param event The event of the field.
 * @param validationModes The modes of the validation.
 * @param inputValue The value of the input.
 */
function handleFieldEvent(form, field, name, event, validationModes, inputValue) {
    batch(() => {
        // Update value state
        field.value.set((prevValue) => field.transform.reduce((current, transformation) => transformation(current, event), inputValue ?? prevValue));
        // Update touched state
        field.touched.set(true);
        form.internal.touched.set(true);
        // Update dirty state
        updateFieldDirty(form, field);
        // Validate value if required
        validateIfRequired(form, field, name, { on: validationModes });
    });
}

/**
 * Initializes and returns the store of a field array.
 *
 * @param form The form of the field array.
 * @param name The name of the field array.
 *
 * @returns The reactive store.
 */
function initializeFieldArrayStore(form, name) {
    // Initialize store on first request
    if (!getFieldArrayStore(form, name)) {
        // Create initial items of field array
        const initial = getPathValue(name, form.internal.initialValues)?.map(() => getUniqueId()) || [];
        // Create signals of field array store
        const initialItems = createSignal(initial);
        const startItems = createSignal(initial);
        const items = createSignal(initial);
        const error = createSignal('');
        const active = createSignal(false);
        const touched = createSignal(false);
        const dirty = createSignal(false);
        // Add store of field array to form
        form.internal.fieldArrays[name] = {
            // Signals
            initialItems,
            startItems,
            items,
            error,
            active,
            touched,
            dirty,
            // Other
            validate: [],
            consumers: new Set(),
        };
        // Add name of field array to form
        form.internal.fieldArrayNames.set((names) => [...names, name]);
    }
    // Return store of field array
    return getFieldArrayStore(form, name);
}

/**
 * Initializes and returns the store of a field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The reactive store.
 */
function initializeFieldStore(form, name) {
    // Initialize store on first request
    if (!getFieldStore(form, name)) {
        // Get initial value of field
        const initial = getPathValue(name, form.internal.initialValues);
        // Create signals of field store
        const elements = createSignal([]);
        const initialValue = createSignal(initial);
        const startValue = createSignal(initial);
        const value = createSignal(initial);
        const error = createSignal('');
        const active = createSignal(false);
        const touched = createSignal(false);
        const dirty = createSignal(false);
        // Add store of field to form
        form.internal.fields[name] = {
            // Signals
            elements,
            initialValue,
            startValue,
            value,
            error,
            active,
            touched,
            dirty,
            // Other
            validate: [],
            transform: [],
            consumers: new Set(),
        };
        // Add name of field to form
        form.internal.fieldNames.set((names) => [...names, name]);
    }
    // Return store of field
    return getFieldStore(form, name);
}

/**
 * Sets an error response if a form error was not set at any field or field
 * array.
 *
 * @param form The form of the errors.
 * @param formErrors The form errors.
 * @param options The error options.
 */
function setErrorResponse(form, formErrors, { shouldActive = true }) {
    // Combine errors that were not set for any field or field array into one
    // general form error response message
    const message = Object.entries(formErrors)
        .reduce((errors, [name, error]) => {
        if ([
            getFieldStore(form, name),
            getFieldArrayStore(form, name),
        ].every((fieldOrFieldArray) => !fieldOrFieldArray ||
            (shouldActive && !untrack(fieldOrFieldArray.active.get)))) {
            errors.push(error);
        }
        return errors;
    }, [])
        .join(' ');
    // If there is a error message, set it as form response
    if (message) {
        form.internal.response.set({
            status: 'error',
            message,
        });
    }
}

/**
 * Updates the invalid state of the form.
 *
 * @param form The store of the form.
 * @param dirty Whether there is an error.
 */
function updateFormInvalid(form, invalid) {
    untrack(() => {
        form.internal.invalid.set(invalid ||
            getFieldAndArrayStores(form).some((fieldOrFieldArray) => fieldOrFieldArray.active.get() && fieldOrFieldArray.error.get()));
    });
}

/**
 * Updates the touched, dirty and invalid state of the form.
 *
 * @param form The store of the form.
 */
function updateFormState(form) {
    // Create state variables
    let touched = false, dirty = false, invalid = false;
    // Check each field and field array and update state if necessary
    untrack(() => {
        for (const fieldOrFieldArray of getFieldAndArrayStores(form)) {
            if (fieldOrFieldArray.active.get()) {
                if (fieldOrFieldArray.touched.get()) {
                    touched = true;
                }
                if (fieldOrFieldArray.dirty.get()) {
                    dirty = true;
                }
                if (fieldOrFieldArray.error.get()) {
                    invalid = true;
                }
            }
            // Break loop if all state values are "true"
            if (touched && dirty && invalid) {
                break;
            }
        }
    });
    // Update state of form
    batch(() => {
        form.internal.touched.set(touched);
        form.internal.dirty.set(dirty);
        form.internal.invalid.set(invalid);
    });
}

/**
 * Focuses the specified field of the form.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 */
function focus(form, name) {
    untrack(() => getFieldStore(form, name)?.elements.get()[0]?.focus());
}

function getValues(form, arg2, arg3) {
    // Get filtered field names to get value from
    const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);
    // Destructure options and set default values
    const { shouldActive = true, shouldTouched = false, shouldDirty = false, shouldValid = false, } = getOptions(arg2, arg3);
    // If no field or field array name is specified, set listener to be notified
    // when a new field is added
    if (typeof arg2 !== 'string' && !Array.isArray(arg2)) {
        form.internal.fieldNames.get();
        // Otherwise if a field array is included, set listener to be notified when
        // a new field array items is added
    }
    else {
        fieldArrayNames.forEach((fieldArrayName) => getFieldArrayStore(form, fieldArrayName).items.get());
    }
    // Create and return values of form or field array
    return fieldNames.reduce((values, name) => {
        // Get store of specified field
        const field = getFieldStore(form, name);
        // Add value if field corresponds to filter options
        if ((!shouldActive || field.active.get()) &&
            (!shouldTouched || field.touched.get()) &&
            (!shouldDirty || field.dirty.get()) &&
            (!shouldValid || !field.error.get())) {
            // Split name into keys to be able to add values of nested fields
            (typeof arg2 === 'string' ? name.replace(`${arg2}.`, '') : name)
                .split('.')
                .reduce((object, key, index, keys) => (object[key] =
                index === keys.length - 1
                    ? // If it is last key, add value
                        field.value.get()
                    : // Otherwise return object or array
                        (typeof object[key] === 'object' && object[key]) ||
                            (isNaN(+keys[index + 1]) ? {} : [])), values);
        }
        // Return modified values object
        return values;
    }, typeof arg2 === 'string' ? [] : {});
}

function reset(form, arg2, arg3) {
    // Filter names between field and field arrays
    const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2, false);
    // Check if only a single field should be reset
    const resetSingleField = typeof arg2 === 'string' && fieldNames.length === 1;
    // Check if entire form should be reset
    const resetEntireForm = !resetSingleField && !Array.isArray(arg2);
    // Get options object
    const options = getOptions(arg2, arg3);
    // Destructure options and set default values
    const { initialValue, initialValues, keepResponse = false, keepSubmitCount = false, keepSubmitted = false, keepValues = false, keepDirtyValues = false, keepItems = false, keepDirtyItems = false, keepErrors = false, keepTouched = false, keepDirty = false, } = options;
    batch(() => untrack(() => {
        // Reset state of each field
        fieldNames.forEach((name) => {
            // Get store of specified field
            const field = getFieldStore(form, name);
            // Reset initial value if necessary
            if (resetSingleField ? 'initialValue' in options : initialValues) {
                field.initialValue.set(() => resetSingleField ? initialValue : getPathValue(name, initialValues));
            }
            // Check if dirty value should be kept
            const keepDirtyValue = keepDirtyValues && field.dirty.get();
            // Reset input if it is not to be kept
            if (!keepValues && !keepDirtyValue) {
                field.startValue.set(field.initialValue.get);
                field.value.set(field.initialValue.get);
                // Reset file inputs manually, as they can't be controlled
                field.elements.get().forEach((element) => {
                    if (element.type === 'file') {
                        element.value = '';
                    }
                });
            }
            // Reset touched if it is not to be kept
            if (!keepTouched) {
                field.touched.set(false);
            }
            // Reset dirty if it is not to be kept
            if (!keepDirty && !keepValues && !keepDirtyValue) {
                field.dirty.set(false);
            }
            // Reset error if it is not to be kept
            if (!keepErrors) {
                field.error.set('');
            }
        });
        // Reset state of each field array
        fieldArrayNames.forEach((name) => {
            // Get store of specified field array
            const fieldArray = getFieldArrayStore(form, name);
            // Check if current dirty items should be kept
            const keepCurrentDirtyItems = keepDirtyItems && fieldArray.dirty.get();
            // Reset initial items and items if it is not to be kept
            if (!keepItems && !keepCurrentDirtyItems) {
                if (initialValues) {
                    fieldArray.initialItems.set(getPathValue(name, initialValues)?.map(() => getUniqueId()) || []);
                }
                fieldArray.startItems.set([...fieldArray.initialItems.get()]);
                fieldArray.items.set([...fieldArray.initialItems.get()]);
            }
            // Reset touched if it is not to be kept
            if (!keepTouched) {
                fieldArray.touched.set(false);
            }
            // Reset dirty if it is not to be kept
            if (!keepDirty && !keepItems && !keepCurrentDirtyItems) {
                fieldArray.dirty.set(false);
            }
            // Reset error if it is not to be kept
            if (!keepErrors) {
                fieldArray.error.set('');
            }
        });
        // Reset state of form if necessary
        if (resetEntireForm) {
            // Reset response if it is not to be kept
            if (!keepResponse) {
                form.internal.response.set({});
            }
            // Reset submit count if it is not to be kept
            if (!keepSubmitCount) {
                form.internal.submitCount.set(0);
            }
            // Reset submitted if it is not to be kept
            if (!keepSubmitted) {
                form.internal.submitted.set(false);
            }
        }
        // Update touched, dirty and invalid state of form
        updateFormState(form);
    }));
}

async function validate(form, arg2, arg3) {
    // Filter names between field and field arrays
    const [fieldNames, fieldArrayNames] = getFilteredNames(form, arg2);
    // Destructure options and set default values
    const { shouldActive = true, shouldFocus = true } = getOptions(arg2, arg3);
    // Create unique validator ID and add it to list
    const validator = getUniqueId();
    form.internal.validators.add(validator);
    // Set validating to "true"
    form.internal.validating.set(true);
    // Run form validation function
    const formErrors = form.internal.validate
        ? await form.internal.validate(untrack(() => getValues(form, { shouldActive })))
        : {};
    // Create valid variable
    let valid = typeof arg2 !== 'string' && !Array.isArray(arg2)
        ? !Object.keys(formErrors).length
        : true;
    const [errorFields] = await Promise.all([
        // Validate each field in list
        Promise.all(fieldNames.map(async (name) => {
            // Get store of specified field
            const field = getFieldStore(form, name);
            // Continue if field corresponds to filter options
            if (!shouldActive || untrack(field.active.get)) {
                // Create local error variable
                let localError;
                // Run each field validation functions
                for (const validation of field.validate) {
                    localError = await validation(untrack(field.value.get));
                    // Break loop if an error occurred
                    if (localError) {
                        break;
                    }
                }
                // Create field error from local and global error
                const fieldError = localError || formErrors[name] || '';
                // Set valid to "false" if an error occurred
                if (fieldError) {
                    valid = false;
                }
                // Update error state of field
                field.error.set(fieldError);
                // Return name if field has an error
                return fieldError ? name : null;
            }
        })),
        // Validate each field array in list
        Promise.all(fieldArrayNames.map(async (name) => {
            // Get store of specified field array
            const fieldArray = getFieldArrayStore(form, name);
            // Continue if field array corresponds to filter options
            if (!shouldActive || untrack(fieldArray.active.get)) {
                // Create local error variable
                let localError = '';
                // Run each field array validation functions
                for (const validation of fieldArray.validate) {
                    localError = await validation(untrack(fieldArray.items.get));
                    // Break loop and if an error occurred
                    if (localError) {
                        break;
                    }
                }
                // Create field array error from local and global error
                const fieldArrayError = localError || formErrors[name] || '';
                // Set valid to "false" if an error occurred
                if (fieldArrayError) {
                    valid = false;
                }
                // Update error state of field
                fieldArray.error.set(fieldArrayError);
            }
        })),
    ]);
    batch(() => {
        // Set error response if necessary
        setErrorResponse(form, formErrors, { shouldActive });
        // Focus first field with an error if specified
        if (shouldFocus) {
            const name = errorFields.find((name) => name);
            if (name) {
                focus(form, name);
            }
        }
        // Update invalid state of form
        updateFormInvalid(form, !valid);
        // Delete validator from list
        form.internal.validators.delete(validator);
        // Set validating to "false" if there is no other validator
        if (!form.internal.validators.size) {
            form.internal.validating.set(false);
        }
    });
    // Return whether fields are valid
    return valid;
}

/**
 * Handles the lifecycle dependent state of a field or field array.
 *
 * @param props The lifecycle properties.
 */
function createLifecycle({ of: form, name, getStore, validate, transform, keepActive = false, keepState = true, }) {
    createEffect(() => {
        // Get store of field or field array
        const store = getStore();
        // Add validation functions
        store.validate = validate
            ? Array.isArray(validate)
                ? validate
                : [validate]
            : [];
        // Add transformation functions
        if ('transform' in store) {
            store.transform = transform
                ? Array.isArray(transform)
                    ? transform
                    : [transform]
                : [];
        }
        // Create unique consumer ID
        const consumer = getUniqueId();
        // Add consumer to field
        store.consumers.add(consumer);
        // Mark field as active and update form state if necessary
        if (!untrack(store.active.get)) {
            batch(() => {
                store.active.set(true);
                updateFormState(form);
            });
        }
        // On cleanup, remove consumer from field
        onCleanup(() => setTimeout(() => {
            store.consumers.delete(consumer);
            // Mark field as inactive if there is no other consumer
            batch(() => {
                if (!keepActive && !store.consumers.size) {
                    store.active.set(false);
                    // Reset state if it is not to be kept
                    if (!keepState) {
                        reset(form, name);
                        // Otherwise just update form state
                    }
                    else {
                        updateFormState(form);
                    }
                }
            });
            // Remove unmounted elements
            if ('elements' in store) {
                store.elements.set((elements) => elements.filter((element) => element.isConnected));
            }
        }));
    });
}

function Field(props) {
  const getField = createMemo(() => initializeFieldStore(props.of, props.name));
  createLifecycle(mergeProps({
    getStore: getField
  }, props));
  return props.children({
    get name() {
      return props.name;
    },
    get value() {
      return getField().value.get();
    },
    get error() {
      return getField().error.get();
    },
    get active() {
      return getField().active.get();
    },
    get touched() {
      return getField().touched.get();
    },
    get dirty() {
      return getField().dirty.get();
    }
  }, {
    get name() {
      return props.name;
    },
    get autofocus() {
      return !!getField().error.get();
    },
    ref(element) {
      getField().elements.set((elements) => [...elements, element]);
      createEffect(() => {
        if (element.type !== "radio" && getField().startValue.get() === void 0 && untrack(getField().value.get) === void 0) {
          const input = getElementInput(element, getField(), props.type);
          getField().startValue.set(() => input);
          getField().value.set(() => input);
        }
      });
    },
    onInput(event) {
      handleFieldEvent(props.of, getField(), props.name, event, ["touched", "input"], getElementInput(event.currentTarget, getField(), props.type));
    },
    onChange(event) {
      handleFieldEvent(props.of, getField(), props.name, event, ["change"]);
    },
    onBlur(event) {
      handleFieldEvent(props.of, getField(), props.name, event, ["touched", "blur"]);
    }
  });
}

function FieldArray(props) {
  const getFieldArray = createMemo(() => initializeFieldArrayStore(props.of, props.name));
  createLifecycle(mergeProps({
    getStore: getFieldArray
  }, props));
  return props.children({
    get name() {
      return props.name;
    },
    get items() {
      return getFieldArray().items.get();
    },
    get error() {
      return getFieldArray().error.get();
    },
    get active() {
      return getFieldArray().active.get();
    },
    get touched() {
      return getFieldArray().touched.get();
    },
    get dirty() {
      return getFieldArray().dirty.get();
    }
  });
}

function Form(props) {
  const [, options, other] = splitProps(props, ["of"], ["keepResponse", "shouldActive", "shouldTouched", "shouldDirty", "shouldFocus"]);
  return ssrElement("form", mergeProps$1({
    novalidate: true
  }, other), void 0, true);
}

/**
 * Creates a validation function that checks the existence of an input.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
function required(error) {
    return (value) => (!value && value !== 0) || (Array.isArray(value) && !value.length)
        ? error
        : '';
}

var _tmpl$$4 = ["<div", ' class="pt-4 text-sm text-red-500 md:text-base lg:pt-5 lg:text-lg dark:text-red-400" id="', '">', "</div>"];
function InputError(props) {
  return ssr(_tmpl$$4, ssrHydrationKey(), `${escape(props.name, true)}-error`, escape(props.error));
}

var _tmpl$$3 = ["<label", "><!--$-->", "<!--/--> <!--$-->", "<!--/--></label>"], _tmpl$2 = ["<span", ' class="ml-1 text-red-600 dark:text-red-400">*</span>'];
function InputLabel(props) {
  return createComponent(Show, {
    get when() {
      return props.label;
    },
    get children() {
      return ssr(_tmpl$$3, ssrHydrationKey() + ssrAttribute("class", escape(clsx("prose inline-block font-medium md:text-lg lg:text-xl", !props.margin && "mb-4 lg:mb-5"), true), false) + ssrAttribute("for", escape(props.name, true), false), escape(props.label), props.required && _tmpl$2[0] + ssrHydrationKey() + _tmpl$2[1]);
    }
  });
}

var _tmpl$$2 = ["<div", "><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"];
function TextInput(props) {
  const [, inputProps] = splitProps(props, ["class", "value", "label", "error", "padding"]);
  let ref;
  const getValue = createMemo((prevValue) => props.value === void 0 ? "" : !Number.isNaN(props.value) ? props.value : prevValue, "");
  const cls = clsx("h-14 w-full rounded-2xl border-2 bg-white px-5 outline-none placeholder:text-slate-500 md:h-16 md:text-lg lg:h-[70px] lg:px-6 lg:text-xl dark:bg-gray-900", props.error ? "border-red-600/50 dark:border-red-400/50" : "border-slate-200 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50");
  const resize = (target) => {
    target.style.height = `${Math.max(target.scrollHeight)}px`;
  };
  createEffect(on([() => ref, () => props.value, () => props.type], ([ref2]) => ref2 && props.type === "textarea" && resize(ref2)));
  return ssr(_tmpl$$2, ssrHydrationKey() + ssrAttribute("class", escape(props.class, true), false), escape(createComponent(InputLabel, {
    get name() {
      return props.name;
    },
    get label() {
      return props.label;
    },
    get required() {
      return props.required;
    }
  })), props.type === "textarea" ? ssrElement("textarea", mergeProps$1(inputProps, {
    get autofocus() {
      return props.autofocus;
    },
    "class": cls,
    get id() {
      return props.name;
    },
    get value() {
      return getValue();
    },
    get ["aria-invalid"]() {
      return !!props.error;
    },
    get ["aria-errormessage"]() {
      return `${props.name}-error`;
    },
    get rows() {
      return props.rows ?? 4;
    },
    style: {
      "overflow-y": "hidden",
      height: "auto"
    }
  }), void 0, true) : ssrElement("input", mergeProps$1({
    type: "text"
  }, inputProps, {
    "class": cls,
    get id() {
      return props.name;
    },
    get value() {
      return getValue();
    },
    get ["aria-invalid"]() {
      return !!props.error;
    },
    get ["aria-errormessage"]() {
      return `${props.name}-error`;
    }
  }), void 0, true), escape(createComponent(InputError, {
    get name() {
      return props.name;
    },
    get error() {
      return props.error;
    }
  })));
}

const userState = makePersisted(
  createStore({
    userId: null,
    username: null,
    accessToken: null,
    refreshToken: null
  }),
  { name: "userData" }
);

var _tmpl$$1 = ["<div", ' class="h-5 w-5 animate-spin rounded-full border-t-2 border-r-2 border-t-current border-r-transparent md:h-[22px] md:w-[22px] md:border-t-[2.5px] md:border-r-[2.5px] lg:h-6 lg:w-6"', "></div>"];
function Spinner(props) {
  return ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("aria-label", escape(props.label, true) || "Loading", false));
}

function ActionButton(props) {
  return ssrElement("button", mergeProps$1({
    get ["class"]() {
      return clsx("items-center rounded-lg px-3 py-1.5 font-medium md:text-md lg:rounded-lg lg:px-4 lg:py-2 lg:text-lg", props.variant === "primary" && "bg-sky-600 text-white hover:bg-sky-600/80 dark:bg-sky-400 dark:text-gray-900 dark:hover:bg-sky-400/80", props.variant === "secondary" && "bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/20", props.variant === "danger" && "bg-red-600 text-white hover:bg-red-600/80 dark:bg-red-400 dark:text-gray-900 dark:hover:bg-red-400/80");
    }
  }, props), () => escape(createComponent(Show, {
    get when() {
      return props.loading;
    },
    get fallback() {
      return props.label;
    },
    get children() {
      return createComponent(Spinner, {
        get label() {
          return `${props.label} is loading`;
        }
      });
    }
  })), true);
}

const BASE_URL$1 = "http://localhost:4322";
const refreshAccessToken = async (user, setUser) => {
  const { accessToken, refreshToken } = user;
  const userAuthData = await fetch(`${BASE_URL$1}/api/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ accessToken, refreshToken })
  }).then(async (response) => {
    if (!response.ok) {
      setUser({ username: null, accessToken: null, refreshToken: null });
      location.assign("/login");
      throw new Error("Failed to refresh token");
    }
    return response.json();
  });
  setUser(userAuthData);
  return userAuthData;
};
const fetchWithTimeout = async (url, options, timeoutMilliseconds = 7e3) => {
  const [user, setUser] = userState;
  const headers = {
    ...options.headers,
    Authorization: user.accessToken ? `Bearer ${user.accessToken}` : ""
  };
  console.log("fetching:", `${BASE_URL$1}${url}`);
  return fetch(`${BASE_URL$1}${url}`, {
    ...options,
    headers,
    signal: AbortSignal.timeout(timeoutMilliseconds)
  }).then(async (response) => {
    let responseJson = await response.json();
    if (response.status === 401 && responseJson.detail === "Token has expired") {
      const userAuthData = await refreshAccessToken(user, setUser);
      const refreshedHeaders = {
        ...headers,
        Authorization: `Bearer ${userAuthData.accessToken}`
      };
      response = await fetch(`${BASE_URL$1}${url}`, {
        ...options,
        headers: refreshedHeaders,
        signal: AbortSignal.timeout(timeoutMilliseconds)
      });
      responseJson = await response.json();
    }
    if (!response.ok) {
      throw new Error(responseJson.detail);
    }
    return responseJson;
  });
};
const get = async (url, options = {}) => {
  return fetchWithTimeout(url, { ...options, method: "GET" });
};
const post = async (url, data = {}, options = {}) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json"
  };
  return fetchWithTimeout(url, {
    ...options,
    headers,
    method: "POST",
    body: JSON.stringify(data)
  });
};
const put = async (url, data, options = {}) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json"
  };
  return fetchWithTimeout(url, {
    ...options,
    headers,
    method: "PUT",
    body: JSON.stringify(data)
  });
};
const del = async (url, options = {}) => {
  return fetchWithTimeout(url, { ...options, method: "DELETE" });
};
const http = { get, post, put, del };

const BASE_URL = "/api/users";
const fetchUserById = async (id) => {
  return http.get(`${BASE_URL}/${id}`);
};
const fetchUsers = async () => {
  return http.get(BASE_URL);
};
const findUsers = async (queryString) => {
  return await http.get(
    `${BASE_URL}?` + new URLSearchParams({ queryString })
  );
};
const createUser = async (data) => {
  return http.post(BASE_URL, data);
};
const updateUser = async (id, data) => {
  return http.put(`${BASE_URL}/${id}`, data);
};
const deleteUser = async (id) => {
  return http.del(`${BASE_URL}/${id}`);
};
const login = async (data) => {
  return http.post(`${BASE_URL}/login`, data);
};
const userActions = {
  fetchUserById,
  fetchUsers,
  findUsers,
  createUser,
  updateUser,
  deleteUser,
  login
};

var _tmpl$ = ["<div", ' class="py-4 text-sm text-red-500 md:text-base lg:pt-5 lg:text-lg dark:text-red-400" id="', '" data-testid="error-message">', "</div>"];
function FormError(props) {
  return createComponent(Show, {
    get when() {
      return props.error;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), `${escape(props.formName, true)}-form-error`, escape(props.error));
    }
  });
}

export { ActionButton as A, FormError as F, TextInput as T, userActions as a, createForm as c, required as r, userState as u };
