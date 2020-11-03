import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropDown } from '../../components';
import './SetsPage.css';
import 'animate.css';
import FadeIn from 'react-fade-in';

const SetsPage = () => {
  const [DropDownValue, setDropDownValue] = useState('all');
  const users = [
    {
      id: 1,
      username: 'velopert',
      title: '정보처리기사',
    },
    {
      id: 2,
      username: 'tester',
      title: '토익영어',
    },
    {
      id: 3,
      username: 'liz',
      title: '전기기사',
    },
    {
      id: 4,
      username: 'liz',
      title: '전기기사',
    },
    {
      id: 5,
      username: 'liz',
      title: '전기기사',
    },
    {
      id: 6,
      username: 'liz',
      title: '전기기사',
    },
    {
      id: 7,
      username: 'liz',
      title: '전기기사',
    },
  ];

  function User({ user }) {
    return (
      <div className="card-container">
        <a className="card4 " href="#">
          <h3>{user.title}</h3>
          <p>({user.username})</p>
          <p className="small"></p>
          <div className="dimmer"></div>
          <div className="go-corner" href="#">
            <div className="go-arrow">→</div>
          </div>
        </a>
      </div>
    );
  }

  const refToTop = useRef();
  const onChanegeHandler = (Value) => {
    setDropDownValue(Value);
  };

  return (
    <div className="Sets-root" ref={refToTop}>
      <div className="Home-BackgroundColor"></div>
      <div className="Sets-container">
        <p style={{ fontSize: '2.7em', fontWeight: '600' }}>세트 목록</p>
        <div className="ButtonContainer">
          <DropDown className="SetsDropDown" onChanegeHandler={onChanegeHandler} />

          <Link to="/create-set">
            <Button variant="outline-dark">
              <span style={{ fontWeight: '800' }}>세트 만들기</span>
            </Button>
          </Link>
        </div>
        <FadeIn delay={250} className="FadeIn-container">
          {DropDownValue == 'all' && users.map((user) => <User user={user} key={user.id} />)}
          {DropDownValue == 'MySet' && users.filter((sets) => sets.username == 'liz').map((user) => <User user={user} key={user.id} />)}
          {DropDownValue == 'Scrap' && users.filter((sets) => sets.username != 'liz').map((user) => <User user={user} key={user.id} />)}
        </FadeIn>
      </div>
      <a
        onClick={() => {
          setTimeout(() => {
            refToTop.current.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
      >
        <button className="to-top">Top</button>
      </a>
    </div>
  );
};

export default SetsPage;
