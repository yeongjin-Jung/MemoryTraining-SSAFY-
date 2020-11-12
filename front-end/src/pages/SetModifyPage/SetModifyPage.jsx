import React, { useState, useEffect, useRef } from 'react';

import { Form, Button } from 'react-bootstrap';
import '../SetPage//SetPage.css';

import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi';

import * as _ from 'lodash';
import axios from 'axios';

import { useLocation } from 'react-router-dom';
import SERVER from '../../api/server';
import server from '../../api/server';
import './SetModifyPage.css';

const SetModifyPage = (props) => {
  const [cards, setCards] = useState([]);
  const [deleteCardList, setDeleteCardList] = useState([]);
  const [updateCardList, setUpdateCardList] = useState([]);
  const [createCardList, setCreateCardList] = useState([]);

  var testRef = useRef(null);
  var contentRef = useRef(null);
  var word = useRef(null);
  var meaning = useRef(null);
  var divAddCardForm = useRef(null);
  const createSetTitle = useRef(null);
  const createSetDescription = useRef(null);

  useEffect(() => {
    console.log('SetModifyPage useEffect called.');
    console.log('SetModifyPage props : ', props);
    console.log('SetModifyPage props.location.state : ', props.location.state);

    for (var i = 0; i < props.location.state.cardList.length; i++) {
      props.location.state.cardList[i].idx = i;
    }

    console.log('props.location.state.cardList : ', props.location.state.cardList);

    setCards(props.location.state.cardList);
  }, []);

  useEffect(() => {
    console.log('cards : ', cards);
    console.log('deleteCardList : ', deleteCardList);
    console.log('updateCardList : ', updateCardList);
    console.log('createCardList : ', createCardList);
  });

  const onDelete = (idx) => {
    console.log(`onDelete called. idx : ${idx}`);
    console.log('cards : ', cards);

    var index = cards.findIndex((i) => i.idx == idx);
    console.log('index : ', index);
    console.log('cards[index] : ', cards[index]);

    let foundForUpdate = updateCardList.find((element) => element.id == cards[index].id);
    console.log('foundForUpdate : ', foundForUpdate);

    if (foundForUpdate != undefined) {
      let idx = updateCardList.findIndex((i) => i.id == foundForUpdate.id);
      console.log('idx : ', idx);

      let tmpUpdateCardList = [...updateCardList];
      tmpUpdateCardList.splice(idx, 1);
      setUpdateCardList(tmpUpdateCardList);
    }

    let foundForCreate = createCardList.find((element) => element.idx == idx);
    console.log('foundForCreate : ', foundForCreate);

    if (foundForCreate != undefined) {
      console.log('foundForCreate idx : ', foundForCreate.idx);
      let iidx = createCardList.findIndex((e) => e.idx == foundForCreate.idx);
      let tmpCreateCardList = [...createCardList];
      tmpCreateCardList.splice(iidx, 1);
      for (var x = 0; x < tmpCreateCardList.length; x++) {
        if (tmpCreateCardList[x].idx > idx) {
          tmpCreateCardList[x].idx--;
        }
      }
      setCreateCardList(tmpCreateCardList);
    } else {
      let tmpCreateCardList = [...createCardList];
      for (var x = 0; x < tmpCreateCardList.length; x++) {
        if (tmpCreateCardList[x].idx > idx) {
          tmpCreateCardList[x].idx--;
        }
      }
      setCreateCardList(tmpCreateCardList);
    }

    if (cards[index].id != undefined) setDeleteCardList([...deleteCardList, cards[index].id]);

    cards.splice(index, 1);

    let tmpCards = [...cards];
    for (var i = 0; i < cards.length; i++) {
      tmpCards[i].idx = cards.length - i - 1;
    }

    setCards(tmpCards);
  };

  const onEdit = (idx) => {
    console.log(`onEdit button clicked. idx is ${idx}`);

    let tmpCards = [...cards];
    var index = cards.findIndex((i) => i.idx == idx);
    tmpCards[index].isEditing = true;

    setCards(tmpCards);
  };

  const onSave = (card) => {
    console.log(`onSave button clicked. idx is ${card.idx}`);
    let tmpCards = [...cards];
    var index = cards.findIndex((i) => i.idx == card.idx);

    // console.log('index : ', index);
    // console.log('cards[index] : ', cards[index]);

    const found = updateCardList.find((element) => element.id == cards[index].id);
    // console.log('found : ', found);

    if (found == undefined) {
      let newObj = {
        id: cards[index].id,
        word: cards[index].word,
        meaning: cards[index].meaning,
      };

      // console.log('newObj : ', newObj);
      // 원래 있던 카드면 수정.
      if (newObj.id != undefined) setUpdateCardList([...updateCardList, newObj]);
      // 원래 있던 카드가 아니면, createList를 index값으로 찾아가서 수정.
      else {
        console.log('원래 있던 카드가 아님!');
        let iidx = cards[index].idx;
        console.log(`바꾸려는 index는 ${iidx}임!`);
        let tmpCreateCardList = [...createCardList];
        let iiidx = createCardList.findIndex((e) => e.idx == iidx);

        tmpCreateCardList[iiidx].word = newObj.word;
        tmpCreateCardList[iiidx].meaning = newObj.meaning;
        setCreateCardList(tmpCreateCardList);
      }
    } else {
      let tmpUpdateCardList = [...updateCardList];
      let changedObj = tmpUpdateCardList.find((element) => element.id == found.id);
      // console.log('before changedObj : ', changedObj);
      changedObj.word = cards[index].word;
      changedObj.meaning = cards[index].meaning;

      // console.log('after changedObj :', changedObj);
    }

    tmpCards[index].word = card.word;
    tmpCards[index].meaning = card.meaning;
    tmpCards[index].isEditing = false;

    setCards(tmpCards);
  };

  const addCard = () => {
    console.log('ADD button clicked.');

    if (word.current.value == '' && meaning.current.value == '') return;

    let inputWord = divAddCardForm.current.children[1].children[0];
    let textareaMeaning = divAddCardForm.current.children[1].children[1];
    let newWord = inputWord.value;
    let newMeaning = textareaMeaning.value;

    let newObj = {
      idx: cards.length,
      word: newWord,
      meaning: newMeaning,
      isEditing: false,
    };

    setCards([...cards, newObj]);

    word.current.value = '';
    meaning.current.value = '';
    meaning.current.style.height = '38px';

    let newObjForSetCreateCardList = {
      idx: newObj.idx,
      word: newObj.word,
      meaning: newObj.meaning,
    };

    setCreateCardList([...createCardList, newObjForSetCreateCardList]);
  };

  const handleKeyUp = (e) => {
    // console.log(meaning.current.value);
    meaning.current.style.height = '5px';
    meaning.current.style.height = meaning.current.scrollHeight + 'px';
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="set-modify-BackgroundColor"></div>
      <div className="set-header" ref={testRef} style={{ width: '80%', height: '250px' }}>
        <div className="" style={{ paddingTop: '1rem' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '500px' }}>
                  <span className="CreateSetHeader-title">학습 세트 수정하기</span>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    style={{ backgroundColor: 'skyblue', border: 'none' }}
                    onClick={() => {
                      console.log('save button clicked.');
                      console.log('createSetTitle.current.value : ', createSetTitle.current.value);
                      console.log('createSetDescription.current.value : ', createSetDescription.current.value);

                      if (createSetTitle.current.value == '') {
                        alert('제목을 입력해주세요');
                      } else if (createSetDescription.current.value == '') {
                        alert('설명을 입력해주세요');
                      } else if (cards.length < 4) {
                        alert('최소 4개의 카드를 추가해주세요');
                      } else {
                        console.log('cards : ', cards);
                        console.log('deleteCardList : ', deleteCardList);
                        const book = {
                          title: createSetTitle.current.value,
                          description: createSetDescription.current.value,
                        };
                        console.log('book : ', book);
                        console.log('cards : ', cards);

                        // 세트 수정 axios
                        axios
                          .delete(SERVER.BASE_URL + SERVER.ROUTES.deleteCard, {
                            data: {
                              card_id: deleteCardList,
                            },
                          })
                          .then((res) => {
                            console.log('delete 카드 리스트 삭제 res : ', res);

                            axios.patch(SERVER.BASE_URL + SERVER.ROUTES.updateCard, { card_list: updateCardList }).then((res) => {
                              console.log('patch 카드 리스트 수정 res : ', res);

                              axios.post(SERVER.BASE_URL + SERVER.ROUTES.createCard, { book_id: props.location.state.book.id, card_list: createCardList }).then((res) => {
                                console.log('post 카드 리스트 추가 res : ', res);
                              });
                            });
                          });
                        alert('저장되었습니다');
                      }
                    }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      var result = window.confirm('정말 삭제하시겠습니까?');
                      if (result) {
                        axios.delete(SERVER.BASE_URL + SERVER.ROUTES.delete + props.location.state.book.id).then((res) => {
                          console.log(res);
                          alert(`[${props.location.state.book.title}] 세트가 삭제되었습니다`);
                          props.history.push('/sets');
                        });
                      } else {
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <span className="CreateSetHeader-title">제목</span>
                <Form.Control className="inputbox create-set-title" type="text" placeholder="제목을 입력하세요." ref={createSetTitle} defaultValue={props.location.state.book.title} />
                <br />
                <span className="CreateSetHeader-title">설명</span>
                <Form.Control
                  className="inputbox create-set-description"
                  type="text"
                  placeholder="설명을 입력하세요."
                  ref={createSetDescription}
                  defaultValue={props.location.state.book.description}
                />
              </div>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'flex-end', width: '10%' }}></div> */}
          </div>
        </div>
      </div>

      <div className="div-add-card-form" style={{ width: '80%', height: '150px' }} ref={divAddCardForm}>
        <span className="CreateSetHeader-title" style={{ paddingBottom: '2rem' }}>
          카드 추가
        </span>
        {/* <form id="input-form"> */}
        <div style={{ display: 'flex' }}>
          <Form.Control className="inputbox mx-3" type="text" placeholder="단어" style={{ width: '50%', height: '38px' }} ref={word} />
          <Form.Control className="inputbox mx-3" as="textarea" placeholder="뜻" style={{ width: '50%', height: '38px' }} onKeyUp={handleKeyUp} ref={meaning} />
          <div>
            <Button type="submit" value="Add" onClick={addCard}>
              <FiPlus />
            </Button>
          </div>
        </div>
        {/* </form> */}
        <div style={{ width: '100%', position: 'relative', marginTop: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span className="CreateSetHeader-title">카드 목록</span>
          </div>

          <div className="set-content" ref={contentRef}>
            {cards
              .sort((a, b) => {
                return b.idx - a.idx;
              })
              .map((card) => (
                <Card card={card} key={card.idx} onDelete={onDelete} onEdit={onEdit} onSave={onSave} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ card, onDelete, onEdit, onSave }) => {
  var modifyword = useRef(null);
  var modifymeaning = useRef(null);

  useEffect(() => {
    // console.log('useEffect() called.');
    // console.log(modifyword);

    if (modifymeaning.current != null) {
      // console.log(modifymeaning.current.value);
      modifymeaning.current.style.height = '5px';
      modifymeaning.current.style.height = modifymeaning.current.scrollHeight + 'px';
    }
  });

  return (
    <div className="added-card draggable" style={{ marginBottom: '10px' }}>
      <div stlye={{ display: 'flex', backgroundColor: 'white' }}>
        <div className="div-card-index" style={{ display: 'flex', borderBottom: '1px solid lightgrey', marginBottom: '1rem' }}>
          <h2>{card.idx + 1}</h2>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            {card.isEditing && (
              <Button
                onClick={() => {
                  console.log(modifyword.current.value);
                  console.log(modifymeaning.current.value);
                  card.word = modifyword.current.value;
                  card.meaning = modifymeaning.current.value;
                  onSave(card);
                }}
              >
                <FiSave size="32" />
              </Button>
            )}
            {!card.isEditing && (
              <Button
                onClick={() => {
                  console.log('edit button clicked.');
                  onEdit(card.idx);
                }}
              >
                <FiEdit2 size="32" />
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                onDelete(card.idx);
              }}
            >
              <FiTrash2 size="32" />
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2rem' }}>
          <div className="mx-3" style={{ width: '40%' }}>
            {card.isEditing && <Form.Control className="inputbox" type="text" placeholder={card.word} ref={modifyword} defaultValue={card.word} />}
            {!card.isEditing && (
              <pre style={{ borderBottom: '5px solid black', wordBreak: 'break-all' }}>
                <span style={{ fontSize: '20px' }}>{card.word}</span>
              </pre>
            )}
            <span className="word">단어</span>
          </div>
          <div className="mx-3" style={{ width: '40%' }}>
            {card.isEditing && <Form.Control className="inputbox" as="textarea" placeholder={card.meaning} ref={modifymeaning} defaultValue={card.meaning} />}
            {!card.isEditing && (
              <pre style={{ borderBottom: '5px solid black', wordBreak: 'break-all' }}>
                <span style={{ fontSize: '20px' }}>{card.meaning}</span>
              </pre>
            )}
            <span className="descpription">뜻</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetModifyPage;
