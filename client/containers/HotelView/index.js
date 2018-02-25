import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import { Container, Beans } from './styled'

@inject(store => ({
  user: store.user.info,
  active: store.hotelView.active
}))
@observer
export default class HotelView extends Component {

  render() {
    const { active, user } = this.props

    return active ? (
      <Container>
        <Beans>
          <Beans.Limited>
            <Beans.Limited.Button>
              Check it out
            </Beans.Limited.Button>
            <Beans.Limited.Image src="http://www.habboxwiki.com/wiki/images/e/eb/Flower_Arrangement.png" />
            <Beans.Limited.Header>
              Brass Water Lilly Pot Rare every 120 credits!
              <Beans.Limited.Header.Bar>
                <Beans.Limited.Header.Bar.Paragraph>
                  Only 120/120 credits to go!
                </Beans.Limited.Header.Bar.Paragraph>
                <Beans.Limited.Header.Bar.Progress width={70} />
              </Beans.Limited.Header.Bar>
            </Beans.Limited.Header>
          </Beans.Limited>
        </Beans>
      </Container>
    ) : null
  }

}
