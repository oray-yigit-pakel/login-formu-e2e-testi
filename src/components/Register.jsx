import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormFeedback,
  CardFooter,
} from 'reactstrap';

const initialValues = {
  ad: '',
  soyad: '',
  email: '',
  password: '',
};

const errorMessages = {
  ad: 'Adınızı en az 3 karakter giriniz',
  soyad: 'Soyadınızı en az 3 karakter giriniz',
  email: 'Geçerli bir email adresi giriniz',
  password:
    'Şifreniz en az 8 karakter, büyük harf, küçük harf, sembol ve rakamdan oluşmalıdır',
};

export default function Register() {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({
    ad: false,
    soyad: false,
    email: false,
    password: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [responseId, setResponseId] = useState('');

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'ad' || name === 'soyad') {
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim().length < 3,
      }));
    }

    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value),
      }));
    }

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: !validatePassword(value),
      }));
    }
  };

  useEffect(() => {
    const isFormValid =
      formData.ad.trim().length >= 3 &&
      formData.soyad.trim().length >= 3 &&
      validateEmail(formData.email) &&
      validatePassword(formData.password);

    setIsValid(isFormValid);
  }, [formData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid) {
      alert('Formda hatalar var. Lütfen düzeltin.');
      return;
    }

    alert('Form gönderiliyor...');

    axios
      .post('https://reqres.in/api/users', formData, {
        headers: {
          'x-api-key': 'reqres-free-v1',
        },
      })
      .then((response) => {
        setResponseId(response.data.id);
        alert('Form başarıyla gönderildi!');
        setFormData(initialValues);
      })
      .catch((error) => {
        console.warn(error);
        alert('Form gönderilirken hata oluştu!');
      });
  };

  return (
    <Card>
      <CardHeader>Kayıt Ol</CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="ad">Ad:</Label>
            <Input
              id="ad"
              name="ad"
              placeholder="Adınızı yazınız"
              type="text"
              onChange={handleChange}
              value={formData.ad}
              invalid={errors.ad}
              data-cy="ad-input"
            />
            {errors.ad && <FormFeedback data-cy="error-message">{errorMessages.ad}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="soyad">Soyad:</Label>
            <Input
              id="soyad"
              name="soyad"
              placeholder="Soyadınızı yazınız"
              type="text"
              onChange={handleChange}
              value={formData.soyad}
              invalid={errors.soyad}
              data-cy="soyad-input"
            />
            {errors.soyad && <FormFeedback data-cy="error-message">{errorMessages.soyad}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email adresinizi giriniz"
              type="email"
              onChange={handleChange}
              value={formData.email}
              invalid={errors.email}
              data-cy="email-input"
            />
            {errors.email && <FormFeedback data-cy="error-message">{errorMessages.email}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Şifre:</Label>
            <Input
              id="password"
              name="password"
              placeholder="Güçlü bir şifre seçiniz"
              type="password"
              onChange={handleChange}
              value={formData.password}
              invalid={errors.password}
              data-cy="password-input"
            />
            {errors.password && (
              <FormFeedback data-cy="error-message">{errorMessages.password}</FormFeedback>
            )}
          </FormGroup>
          <Button color="primary" disabled={!isValid} data-cy="submit-button">
            Kayıt Ol
          </Button>
        </Form>
      </CardBody>
      <CardFooter>
        {responseId && (
          <div>
            <strong>Kayıt ID'niz:</strong> {responseId}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
// her şey tamam