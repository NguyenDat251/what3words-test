import { useCallback, useEffect, useState } from "react";
import { Selection } from "../";
import axios from "axios";
import styled from "styled-components";
import { useForm, useController } from "react-hook-form";
import { toast } from "react-toastify";

const FETCH_DATA_URL = "https://jsonplaceholder.typicode.com/users";
const SUBMIT_DATA_URL = "https://jsonplaceholder.typicode.com/posts";
const USER_REQUIRED_ERROR = "Please select a user";

const Form = () => {
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [options, setOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    control,
  } = useForm();

  const { field: userIdField } = useController({
    name: "userId",
    control,
    rules: { required: USER_REQUIRED_ERROR },
  });

  const onSubmit = useCallback(async (data) => {
    try {
      await axios.post(SUBMIT_DATA_URL, data);
    } catch (e) {
      toast.error(e.message);
    }
  }, []);

  const validateSelectedUserId = useCallback((userId) => {
    if (!userId) return USER_REQUIRED_ERROR;
    return undefined;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingOptions(true);
      const { data } = await axios.get(FETCH_DATA_URL);
      setIsFetchingOptions(false);
      setOptions(data);
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Selection
          label="Please select the user"
          options={options}
          validateFn={() =>
            errors.userId && validateSelectedUserId(userIdField.value)
          }
          handleSelectOption={userIdField.onChange}
          selectedOption={userIdField.value}
          disabled={isSubmitting}
          isFetchingOptions={isFetchingOptions}
        />
        <InputZoneWrapper>
          <InputWrapper>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Some title"
              disabled={isSubmitting}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="errorText">{errors.title.message}</span>
            )}
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="title">Body</label>
            {/* I am not sure what the body text field supposed to be, so I just made it a text field */}
            <BodyInput
              type="text"
              placeholder="Some text"
              disabled={isSubmitting}
              {...register("body", { required: "Body is required" })}
            />
            {errors.body && (
              <span className="errorText">{errors.body.message}</span>
            )}
          </InputWrapper>
        </InputZoneWrapper>
        <SubmitButton disabled={isSubmitting}>Submit</SubmitButton>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #ffffff;
  color: #000000;
  padding: 43px 58px 58px 37px;
  width: 100%;
  max-width: 675px;

  & label {
    font-weight: 600;
  }

  & .errorText {
    color: #ed684e;
    margin-top: 16px;
    display: block;
  }
`;

const InputZoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;

  & input {
    border: none;
    border-bottom: 1px solid #0a3049;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  padding: 6px 0 24px 0;
`;

const BodyInput = styled.input`
  padding-bottom: 24px;
`;

const SubmitButton = styled.button`
  width: 240px;
  height: 48px;
  text-align: center;
  background-color: #e11f26;
  border: none;
  border-radius: 2px;
  color: #ffffff;
  font-weight: 400;
  margin-top: 36px;
  cursor: pointer;
`;

export default Form;
