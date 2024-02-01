import "./Selection.css";
import { useCallback } from "react";
import styled from "styled-components";

const Selection = ({
  label,
  validateFn,
  selectedOption,
  handleSelectOption,
  options,
  disabled,
  isFetchingOptions,
}) => {
  const errorMessage = validateFn();

  const onSelectOption = useCallback(
    (id) => {
      if (disabled) return;

      handleSelectOption(id);
    },
    [disabled, handleSelectOption]
  );

  return (
    <Wrapper>
      <Label>{label}</Label>
      {isFetchingOptions ? (
        <span>Loading...</span>
      ) : (
        <SelectionWrapper>
          {options.map((option) => {
            const { id, name } = option;
            const isSelected = selectedOption === id;

            return (
              <SelectionOption
                data-testid={`option-${id}`}
                key={id}
                className={`option ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectOption(id)}
                $isSelected={isSelected}
                $disabled={disabled}
              >
                <p>{name}</p>
              </SelectionOption>
            );
          })}
        </SelectionWrapper>
      )}
      <span className="errorText">{errorMessage}</span>
    </Wrapper>
  );
};

const SelectionOption = styled.div`
  border: ${({ $isSelected }) =>
    !$isSelected ? "1px solid #C2C2C2" : "4px solid #3CABAA"};
  background-color: ${({ $isSelected }) =>
    !$isSelected ? "#FFFFFF" : "#DBEFFA"};
  padding: 0 15.94px 0 16px;
  white-space: normal;
  height: 72px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 600;

  overflow-y: scroll;
  text-align: left;

  display: flex;
  align-items: center;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  & p {
    width: 105px;
  }
`;

const SelectionWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 24px;
  grid-column-gap: 10px;
`;

const Wrapper = styled.div`
  padding: 0 0 16px 0;
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 24px;
  color: #0a3049;
`;

export default Selection;
