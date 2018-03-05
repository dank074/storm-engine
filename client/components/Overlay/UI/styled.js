import styled from 'styled-components'
import { Row, Col } from 'react-flexbox-grid'

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 48px;
  background-color: #1D1E20;½x
  padding-left: 2vw;
  padding-right: 2vw;
  vertical-align: middle;
`

export const Chat = styled.input`
  width: 30vw;
  font-family: 'Ubuntu Condensed';
  padding: 0 10px 0 29px;
  background-color: #E8E8E8;
  border-radius: 5px;
  &::placeholder {
  }
`

export const Horizontal = styled.div`
  height: 48px;
  display: flex;
  justify-content: center;
`

export const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
