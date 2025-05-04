import styled from 'styled-components';

export const Body = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const MainContainer = styled.main`
  width: 100%;
  height: 100vh;
  background-color: var(--white-off);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 80%;
  max-width: 37.5rem;
  height: 100%;
  max-height: 43.75rem;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ChatHeader = styled.header`
  width: 100%;
  height: 5.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const ChatTitle = styled.span`
  font-family: var(--font-Bebas);
  font-size: 40px;
  font-weight: 400;
`;

export const ChatTitleItalic = styled.span`
  font-family: var(--font-Bebas);
  font-size: 2.5rem;

  font-weight: 600;
  font-style: italic;
`;

export const ChatContainer = styled.div`
  min-height: 80%;
  background-color: var(--white-primary);
  border-radius: 0.4375rem;
  border: 0.25rem solid var(--furia-gray-dark-1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
