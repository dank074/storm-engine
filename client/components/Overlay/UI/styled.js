import styled from 'styled-components'
import { Row, Col } from 'react-flexbox-grid'

export const Dashboard = styled.div`
  background: #1E1E20;
  width: 100vw;
  position: fixed;
  bottom: 0;
`

export const Outline = styled.div`
  cursor: pointer;
  background-image: url(${props => props.src});
  -webkit-filter:
    drop-shadow(0 1px 0 #FFF)
    drop-shadow(0 -1px 0 #FFF)
    drop-shadow(1px 0 0 #FFF)
    drop-shadow(-1px 0 0 #FFF)
    drop-shadow(0 0 10px rgba(000,000,000,000));
`

export const Chat = styled.input`
  font-family: 'Ubuntu Condensed';
  border-radius: 4px;
  box-shadow: 0 1px 0 #828181 inset;
`
