import styled from 'styled-components';

export const Body = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const MainContainer = styled.main`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white-off);
`;

export const Content = styled.div`
  width: 80%;
  max-width: 37.5rem;
  height: 100%;
`;

export const ChatContainer = styled.div`
  width: 100%;
  background-color: var(--white-primary);
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;
