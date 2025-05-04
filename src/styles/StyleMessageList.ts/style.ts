import styled from 'styled-components';

export const ListContainer = styled.div`
  height: 100%;
  max-height: 40.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    border-top-right-radius: 10px;
    width: 5px;
    background-color: var(--furia-gray-dark-1);
    margin-right: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--furia-gray-medium);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    height: 10px;
  }
`;

export const NoMessageContainer = styled.p`
  text-align: center;
  color: var(--furia-gray-medium);
  font-family: var(--font-nunito);
`;

export const BotName = styled.span`
  font-weight: bold;
`;

export const SpanMessage = styled.span`
  font-family: var(--font-nunito);
  line-height: 1.5;
`;

export const HourText = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
`;
