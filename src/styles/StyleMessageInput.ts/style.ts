import styled from 'styled-components';

export const SendMessageContainer = styled.form`
  height: 3.125rem;
  border-top: 2px solid var(--furia-gray-dark-1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 1rem;
  gap: 0.625rem;
`;

export const InputContainer = styled.input`
  width: 100%;
  padding: 5px;
  border: 0;
  &:focus {
    outline: none;
    border: none;
  }
  font-family: var(--font-nunito);
  cursor: pointer;
`;

export const Button = styled.button`
  font-family: var(--font-nunito);
  font-size: 0.9375rem;
  font-weight: bold;

  background-color: var(--furia-purple);
  border: 0.125rem solid var(--furia-purple-light);
  border-radius: 0.3125rem;
  padding: 0.1875rem 0.625rem;
  color: var(--white-primary);
  &:hover {
    transition: 0.1s;
    background-color: var(--furia-purple-light);
    border: 0.125rem solid var(--furia-purple);
  }

  cursor: pointer;
`;
