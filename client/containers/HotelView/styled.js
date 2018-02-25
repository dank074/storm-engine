import styled from 'styled-components'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.xmas ? '#05212D' : '#68E5FF'};
`

Container.Drape = styled.div`
	position: absolute;
	top: 0px;
	left: 0px;
	background-image: url(${props => props.src});
	height: 200px;
	width: 145px;
	z-index: 10;
`

Container.Background = {}

Container.Background.Left = styled.div`
  position: absolute;
  left: 0;
  bottom: 40px;
  width: 413px;
  height: 124px;
  background-image: url(${props => props.src});
`

Container.Background.Left.Image = styled.img`
  position: absolute;
  bottom: 40px;
  left: 120px;
`

Container.Background.Right = styled.div`
  position: absolute;
  right: 0;
  bottom: 40px;
  z-index: 0;
  width: 484px;
  height: 463px;
  background-image: url(${props => props.src});
`

/*export const Container = styled.div`
  width: 1200px;
  overflow: hidden;
  position: relative;
  height: 100%;
  margin: 0 auto;
`*/

export const Beans = styled.div`
  width: 890px;
  margin: 0 auto;
  height: 100%;
  z-index: 2;
  overflow-x: auto;
  margin-top: 10px;
`

Beans.Limited = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid #1D343E;
  width: 550px;
  height: 60px;
  border-radius: 6px;
  position: relative;
  padding: 7px;
  box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
`
Beans.Limited.Image = styled.img`
  position: absolute;
  left: 20px;
  top: -20px;
`

Beans.Limited.Header = styled.h1`
  text-align: center;
  font-weight: 600;
  color: #000;
  font-size: 16px;
`

Beans.Limited.Button = styled.a`
  position: absolute;
  right: 10px;
  top: 15px;
  padding: 5px;
`

Beans.Limited.Header.Bar = styled.div`
	width: 300px;
	background-color: #5A534F;
	border-radius: 6px;
	margin: 0 auto;
	border: 1px solid #000;
	box-shadow: inset 0 0 0 2px #E1E1E1;
	padding: 2px;
	text-align: center;
	position: relative;
`

Beans.Limited.Header.Bar.Paragraph = styled.p`
	font-size: 13px;
	color: #fff;
	text-align: center;
	width: 100%;
	vertical-align: middle;
	position: absolute;
	margin-bottom: 5px;
	text-shadow: 1px 1px 1px #000000;
`

Beans.Limited.Header.Bar.Progress = styled.div`
  background-color: #00B4C1;
  width: ${props => props.width}%;
  display: block;
  height: 15px;
	border-radius: 3px;
  transition: width 1s;
  -moz-transition: width 1s;
`

/*export const Beans = {
  Container: styled.div`
    width: 890px;
    margin: 0 auto;
    height: 100%;
    z-index: 2;
    overflow-x: auto;
    margin-top: 10px;
  `,
  Limited: {
    Container: styled.div`
    	background-color: rgba(255, 255, 255, 0.2);
    	border: 1px solid #1D343E;
    	width: 550px;
    	height: 60px;
    	border-radius: 6px;
    	position: relative;
    	padding: 7px;
    	box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.2);
    	margin-bottom: 20px;
    `,
    Image: styled.img`
    	position: absolute;
    	left: 20px;
    	top: -20px;
    `,
    Header: styled.h1`
    	text-align: center;
    	font-weight: 600;
    	color: #000;
    	font-size: 16px;
    `,
    IlluminaButton: styled.a`
    	position: absolute;
    	right: 10px;
    	top: 15px;
    	padding: 5px;
    `
  }
}*/

export const Bean = styled.div`
  color: #fff;
  float: left;
  position: relative;
  display: inline-block;
  margin-bottom: 100px;
  width: ${props => props.small ? 40 : 60}%;
`

Bean.Image = styled.img`
  float: left;
  margin-right: 70px;
`

Bean.Span = styled.span`
  height: 100px;
  display: block;
`

/*export const Bean = {
  Img: styled.img`
    float: left;
    margin-right: 70px;
  `,
  Span: styled.span`
    height: 100px;
    display: block;
  `,
  Header: styled.h1`
  	font-weight: 600;
  	display: block;
  	font-size: 18px;
  	line-height: 18px;
  	margin-bottom: 5px;
  `,
  Paragraph: styled.p`
  	font-weight: 400;
  	font-size: 12px;
  	line-height: 14px;
  	margin-bottom: 20px;
  `
}*/
