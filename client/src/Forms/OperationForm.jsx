import React, { useState, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import GetUserData from '../Auth/GetUserData';
export default function OperationForm(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [base64Data, setBase64Data] = useState(null);
  const fileUploader = useRef(null);
  const places = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];
  const validate = (data) => {
    let errors = {};

    if (!data.datum) {
      errors.datum = 'Dátum je povinný';
    }
    // else {
    //   fetch(
    //     `/add/dostupneMiestnosti/${2}/${data.trvanie}/${encodeURIComponent(
    //       data.datum.toLocaleString('en-GB').replace(',', '')
    //     )}`
    //   )
    //     .then((response) => response.json())
    //     .then((data) => console.log(data));
    // }
    if (!data.popis) {
      errors.popis = 'Popis je povinný';
    }
    if (!data.trvanie) {
      errors.trvanie = 'Trvanie je povinné';
    }
    if (!data.miestnost) {
      errors.miestnost = 'Miestnosť je povinná';
    }
    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('hospit-user');
    const userData = GetUserData(token);
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        rod_cislo: data.rod_cislo === '' ? null : data.rod_cislo,
        datum: data.datum.toLocaleString('en-GB').replace(',', ''),
        trvanie: data.trvanie,
        popis: data.popis,
        id_lekara: userData.UserInfo.userid,
        priloha: base64Data,
        id_miestnosti: data.miestnost.id,
      }),
    };
    const responsePatient = await fetch(
      '/add/operacia',
      requestOptionsPatient
    ).then(() => setShowMessage(true));
    console.log(responsePatient);

    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className='p-error'>{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className='flex justify-content-center'>
      <Button
        label='OK'
        className='p-button-text'
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };
  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBase64Data(reader.result.substring(reader.result.indexOf(',') + 1));
      console.log(reader.result);
    };
  };

  return (
    <div
      style={{ width: '100%', marginTop: '2rem' }}
      className='p-fluid grid formgrid'
    >
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position='top'
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className='flex align-items-center flex-column pt-6 px-3'>
          <i
            className='pi pi-check-circle'
            style={{ fontSize: '5rem', color: 'var(--green-500)' }}
          ></i>
          <h5>Úspešné vytvorenie operácie</h5>
        </div>
      </Dialog>

      <div className='field col-12'>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            rod_cislo:
              props.rod_cislo !== null || typeof props.rod_cislo !== 'undefined'
                ? props.rod_cislo
                : '',
            datum: null,
            popis: '',
            trvanie: '',
            miestnost: null,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className='p-fluid'>
              <Field
                name='rod_cislo'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='rod_cislo'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Rodné číslo
                    </label>
                    <InputMask
                      id='rod_cislo'
                      mask='999999/9999'
                      disabled={
                        props.rod_cislo !== null &&
                        typeof props.rod_cislo !== 'undefined'
                          ? true
                          : false
                      }
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />

                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <Field
                name='datum'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='datum'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Dátum*
                    </label>
                    <Calendar
                      id='basic'
                      {...input}
                      dateFormat='dd.mm.yy'
                      mask='99.99.9999'
                      showIcon
                      showTime
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='popis'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='popis'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Popis*
                    </label>
                    <InputTextarea
                      id='popis'
                      rows={5}
                      cols={30}
                      autoResize
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <Field
                name='trvanie'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='trvanie'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Trvanie v minútach*
                    </label>
                    <InputText
                      id='trvanie'
                      {...input}
                      mode='decimal'
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />

                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='miestnost'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='miestnost'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Miestnosť
                    </label>
                    <Dropdown
                      id='miestnost'
                      {...input}
                      options={places}
                      optionLabel='id'
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <div className='field col-12 '>
                <label htmlFor='basic'>Príloha</label>
                <FileUpload
                  ref={fileUploader}
                  mode='advanced'
                  accept='image/*'
                  customUpload
                  chooseLabel='Vložiť'
                  cancelLabel='Zrušiť'
                  headerTemplate={headerTemplate}
                  maxFileSize={50000000}
                  onSelect={customBase64Uploader}
                  uploadHandler={customBase64Uploader}
                  emptyTemplate={
                    <p className='m-0'>
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
              </div>

              <div
                className='field col-12 '
                style={{ justifyContent: 'center', display: 'grid' }}
              >
                <Button
                  type='submit'
                  style={{ width: '50vh' }}
                  className='p-button-lg'
                  label='Odoslať'
                  icon='pi pi-check'
                  iconPos='right'
                />
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
}
