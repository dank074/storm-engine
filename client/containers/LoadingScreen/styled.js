import styled from 'styled-components'

export const Image = {
  Stack: styled.div`
  	display: block;
  	background-image: url(${props => props.src});
  	width: 490px;
  	height: 434px;
  	margin: 0 auto;
  	margin-bottom: 20px;
    position: relative;
  `,
  Photo: styled.div`
  	height: 320px;
  	width: 320px;
  	position: absolute;
  	left: 95px;
  	top: 50px;
    background-image: url(${props => props.src});
  `,
  Frame: styled.div`
  	background-image: url(${props => props.src});
  	width: 500px;
  	height: 434px;
  	position: absolute;
  	left: 0;
    top: 0;
  `
}

export const Progress = {
  Container: styled.div`
	  border: 1px solid #fff;
    width: 400px;
    display: block;
  	border-radius: 2px;
    margin: 0 auto;
  	background-color: #000;
  	box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 1);
    padding: 2px;
  `,
  Bar: styled.div`
    background-image: linear-gradient(bottom, #8CA1AD 50%, #BACAD3 50%);
    background-image: -o-linear-gradient(bottom, #8CA1AD 50%, #BACAD3 50%);
    background-image: -moz-linear-gradient(bottom, #8CA1AD 50%, #BACAD3 50%);
    background-image: -webkit-linear-gradient(bottom, #8CA1AD 50%, #BACAD3 50%);
    background-image: -ms-linear-gradient(bottom, #8CA1AD 50%, #BACAD3 50%);
    display: flex;
    height: 20px;
    width: ${props => props.width}%; /* 400px is parent width, and with padding of both sides it's 2x2=4*/
    transition: width 1s;
    -webkit-transition: width 1s;
    -moz-transition: width 1s;
  `,
  Count: styled.p`
    font-weight: 600;
    text-align: center;
    display: block;
    padding-top: 5px;
    color: #8D8E8E;
  `
}

export const Container = styled.div`
	top: 0;
  left: 0;
  position: absolute;
  background: #0E151C;/*#2a354c;*/
  color: #fff;
  width: inherit;
  height: inherit;
`

export const Message = styled.p`
  font-family: 'Ubuntu Condensed';
  font-weight: bold;
  font-size: 28px;
  text-align: center;
  color: #FFF;
  padding-bottom: 20px;
`
