import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SERVER from '../../api/server';
import * as _ from 'lodash';

import { Form } from 'react-bootstrap';
import { FiPlus, FiTrash2, FiEdit2, FiSave } from 'react-icons/fi';
import MaterialButton from '@material-ui/core/Button';

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
    //수정 console.log('SetModifyPage useEffect called.');
    //수정 console.log('SetModifyPage props : ', props);
    //수정 console.log('SetModifyPage props.location.state : ', props.location.state);

    for (var i = 0; i < props.location.state.cardList.length; i++) {
      props.location.state.cardList[i].idx = i;
    }

    //수정 console.log('props.location.state.cardList : ', props.location.state.cardList);

    setCards(props.location.state.cardList);
  }, []);

  useEffect(() => {
    //수정 console.log('cards : ', cards);
    //수정 console.log('deleteCardList : ', deleteCardList);
    //수정 console.log('updateCardList : ', updateCardList);
    //수정 console.log('createCardList : ', createCardList);
  });

  const onDelete = (idx) => {
    //수정 console.log(`onDelete called. idx : ${idx}`);
    //수정 console.log('cards : ', cards);

    var index = cards.findIndex((i) => i.idx == idx);
    //수정 console.log('index : ', index);
    //수정 console.log('cards[index] : ', cards[index]);

    let foundForUpdate = updateCardList.find((element) => element.id == cards[index].id);
    //수정 console.log('foundForUpdate : ', foundForUpdate);

    if (foundForUpdate != undefined) {
      let idx = updateCardList.findIndex((i) => i.id == foundForUpdate.id);
      //수정 console.log('idx : ', idx);

      let tmpUpdateCardList = [...updateCardList];
      tmpUpdateCardList.splice(idx, 1);
      setUpdateCardList(tmpUpdateCardList);
    }

    let foundForCreate = createCardList.find((element) => element.idx == idx);
    //수정 console.log('foundForCreate : ', foundForCreate);

    if (foundForCreate != undefined) {
      //수정 console.log('foundForCreate idx : ', foundForCreate.idx);
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
    //수정 console.log(`onEdit button clicked. idx is ${idx}`);

    let tmpCards = [...cards];
    var index = cards.findIndex((i) => i.idx == idx);
    tmpCards[index].isEditing = true;

    setCards(tmpCards);
  };

  const onSave = (card) => {
    //수정 console.log(`onSave button clicked. idx is ${card.idx}`);
    let tmpCards = [...cards];
    var index = cards.findIndex((i) => i.idx == card.idx);

    // //수정 console.log('index : ', index);
    // //수정 console.log('cards[index] : ', cards[index]);

    const found = updateCardList.find((element) => element.id == cards[index].id);
    // //수정 console.log('found : ', found);

    if (found == undefined) {
      let newObj = {
        id: cards[index].id,
        word: cards[index].word,
        meaning: cards[index].meaning,
      };

      // //수정 console.log('newObj : ', newObj);
      // 원래 있던 카드면 수정.
      if (newObj.id != undefined) setUpdateCardList([...updateCardList, newObj]);
      // 원래 있던 카드가 아니면, createList를 index값으로 찾아가서 수정.
      else {
        //수정 console.log('원래 있던 카드가 아님!');
        let iidx = cards[index].idx;
        //수정 console.log(`바꾸려는 index는 ${iidx}임!`);
        let tmpCreateCardList = [...createCardList];
        let iiidx = createCardList.findIndex((e) => e.idx == iidx);

        tmpCreateCardList[iiidx].word = newObj.word;
        tmpCreateCardList[iiidx].meaning = newObj.meaning;
        setCreateCardList(tmpCreateCardList);
      }
    } else {
      let tmpUpdateCardList = [...updateCardList];
      let changedObj = tmpUpdateCardList.find((element) => element.id == found.id);

      changedObj.word = cards[index].word;
      changedObj.meaning = cards[index].meaning;
    }

    tmpCards[index].word = card.word;
    tmpCards[index].meaning = card.meaning;
    tmpCards[index].isEditing = false;

    setCards(tmpCards);
  };

  const addCard = () => {
    if (word.current.value == '' || meaning.current.value == '') {
      alert('단어와 뜻을 입력해주세요.');
      return;
    }

    const found = cards.find((card) => card.word == word.current.value || card.meaning == meaning.current.value);
    if (found != undefined) {
      alert('중복된 단어나 뜻이 이미 세트에 존재합니다.');
      return;
    }

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
    word.current.style.height = '43px';

    meaning.current.value = '';
    meaning.current.style.height = '43px';

    let newObjForSetCreateCardList = {
      idx: newObj.idx,
      word: newObj.word,
      meaning: newObj.meaning,
    };

    setCreateCardList([...createCardList, newObjForSetCreateCardList]);
  };

  const WordhandleKeyUp = (e) => {
    word.current.style.height = '5px';
    word.current.style.height = word.current.scrollHeight + 'px';
  };

  const MeaninghandleKeyUp = (e) => {
    meaning.current.style.height = '5px';
    meaning.current.style.height = meaning.current.scrollHeight + 'px';
  };

  const createSetDescriptionKeyUp = () => {
    // createSetDescription.current.style.height = '10px';
    createSetDescription.current.style.height = createSetDescription.current.scrollHeight + 'px';
  };

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="set-modify-BackgroundColor"></div>
      <div className="container" style={{ paddingTop: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <span className="CreateSetHeader-title">학습 세트 수정하기</span>
          <div>
            <MaterialButton
              variant="contained"
              style={{ fontWeight: '800', margin: '0 0.5rem', padding: '6px 8px' }}
              color={'primary'}
              // startIcon={<FiSave size="32" />}
              // className={classes.button}
              className="btn-save"
              onClick={() => {
                const found = cards.find((card) => card.isEditing != undefined && card.isEditing == true);
                if (found != undefined) {
                  alert('수정중인 카드가 존재합니다. 수정을 마치고 저장해주세요.');
                  return;
                }

                //수정 console.log('save button clicked.');
                //수정 console.log('createSetTitle.current.value : ', createSetTitle.current.value);
                //수정 console.log('createSetDescription.current.value : ', createSetDescription.current.value);

                if (createSetTitle.current.value == '') {
                  alert('제목을 입력해주세요');
                } else if (createSetDescription.current.value == '') {
                  alert('설명을 입력해주세요');
                } else if (cards.length < 4) {
                  alert('최소 4개의 카드를 추가해주세요');
                } else {
                  //수정 console.log('cards : ', cards);
                  //수정 console.log('deleteCardList : ', deleteCardList);
                  const book = {
                    title: createSetTitle.current.value,
                    description: createSetDescription.current.value,
                  };
                  //수정 console.log('book : ', book);
                  //수정 console.log('cards : ', cards);

                  // 세트 수정 axios
                  axios
                    .delete(SERVER.BASE_URL + SERVER.ROUTES.deleteCard, {
                      data: {
                        card_id: deleteCardList,
                      },
                    })
                    .then((res) => {
                      // //수정 console.log('delete 카드 리스트 삭제 res : ', res);

                      axios.patch(SERVER.BASE_URL + SERVER.ROUTES.updateCard, { card_list: updateCardList }).then((res) => {
                        // //수정 console.log('patch 카드 리스트 수정 res : ', res);

                        axios.post(SERVER.BASE_URL + SERVER.ROUTES.createCard, { book_id: props.location.state.book.id, card_list: createCardList }).then((res) => {
                          // //수정 console.log('post 카드 리스트 추가 res : ', res);

                          // //수정 console.log('props : ', props);
                          // //수정 console.log('주소 : ', SERVER.BASE_URL + SERVER.ROUTES.update + props.location.state.book.id + '/');
                          axios
                            .patch(SERVER.BASE_URL + SERVER.ROUTES.update + props.location.state.book.id + '/', {
                              title: createSetTitle.current.value,
                              description: createSetDescription.current.value,
                            })
                            .then((res) => {
                              // //수정 console.log('--------------------------------------------------------------------------------');
                              // //수정 console.log('patch 세트 제목, 설명 수정 res : ', res);
                              alert(`[${props.location.state.book.title}] 세트가 수정되었습니다.`);
                              let bookData = {
                                ...res.data,
                                write_flag: 1,
                              };

                              // //수정 console.log('bookData : ', bookData);
                              props.history.push({ pathname: '/set-detail', state: { book: bookData } });
                            });
                        });
                      });
                    });
                }
              }}
            >
              <FiSave size="32" />
              <span className="span-save" style={{ marginLeft: '8px' }} >세트 저장</span>
            </MaterialButton>
            <MaterialButton
              variant="contained"
              style={{ fontWeight: '800', margin: '0 0.5rem', padding: '6px 8px' }}
              color={'secondary'}
              // startIcon={<FiTrash2 size="32" />}
              className="btn-trash"
              onClick={() => {
                var result = window.confirm('정말 삭제하시겠습니까?');
                if (result) {
                  axios.delete(SERVER.BASE_URL + SERVER.ROUTES.delete + props.location.state.book.id).then((res) => {
                    //수정 console.log(res);
                    alert(`[${props.location.state.book.title}] 세트가 삭제되었습니다.`);
                    props.history.push('/sets');
                  });
                } else {
                  //취소
                }
              }}
            >
              <FiTrash2 size="32" />
              <span className="span-trash" style={{ marginLeft: '8px' }} >세트 삭제</span>
            </MaterialButton>
          </div>
        </div>
        <div className="draggable bg-color-white" style={{ marginTop: '10px', padding: '1.5rem' }}>
          <span className="CreateSetHeader-title">제목</span>
          <Form.Control
            className="inputbox create-set-title"
            type="text"
            style={{ borderRadius: 0 }}
            placeholder="제목을 입력하세요."
            ref={createSetTitle}
            defaultValue={props.location.state.book.title}
          />
          <br />
          <span className="CreateSetHeader-title">설명</span>
          <Form.Control
            className="inputbox create-set-description"
            as="textarea"
            placeholder="설명을 입력하세요."
            style={{ width: '100%', height: '41px', borderRadius: 0 }}
            onKeyUp={createSetDescriptionKeyUp}
            ref={createSetDescription}
            defaultValue={props.location.state.book.description}
          />
          <div className="div-add-card-form" style={{ position: 'relative', width: '100%', marginTop: '60px' }} ref={divAddCardForm}>
            <span className="CreateSetHeader-title">카드 추가</span>
            <div style={{ display: 'flex', width: '100%', marginTop: '20px' }}>
              <Form.Control className="inputbox mx-3 word-input" as="textarea" placeholder="단어" style={{ width: '40%', height: '43px', borderRadius: 0 }} onKeyUp={WordhandleKeyUp} ref={word} />
              <Form.Control
                className="inputbox mx-3 meaning-input"
                as="textarea"
                placeholder="뜻"
                style={{ width: '60%', height: '43px', borderRadius: 0 }}
                onKeyUp={MeaninghandleKeyUp}
                ref={meaning}
              />
              <MaterialButton variant="contained" color={'primary'} style={{ height: '43px' }} onClick={addCard}>
                <FiPlus size="24" />
              </MaterialButton>
            </div>
          </div>
        </div>
        {/* </form> */}
        <div style={{ width: '100%', position: 'relative', marginTop: '30px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span className="CreateSetHeader-title">카드 목록</span>
          </div>

          <div className="set-content" ref={contentRef}>
            {cards
              .sort((a, b) => {
                return b.idx - a.idx;
              })
              .map((card) => (
                <Card cards={cards} card={card} key={card.idx} onDelete={onDelete} onEdit={onEdit} onSave={onSave} />
              ))}
          </div>
        </div>
      </div>
    </div >
  );
};

const Card = ({ cards, card, onDelete, onEdit, onSave }) => {
  var modifyword = useRef(null);
  var modifymeaning = useRef(null);

  useEffect(() => {
    // //수정 console.log('useEffect() called.');
    // //수정 console.log(modifyword);

    if (modifymeaning.current != null) {
      //수정 console.log(modifymeaning.current.value);

      modifyword.current.style.height = '5px';
      modifyword.current.style.height = modifyword.current.scrollHeight + 'px';

      modifymeaning.current.style.height = '5px';
      modifymeaning.current.style.height = modifymeaning.current.scrollHeight + 'px';
    }
  });

  const handleModifyWord = () => {
    modifyword.current.style.height = '5px';
    modifyword.current.style.height = modifyword.current.scrollHeight + 'px';
  };

  const handleModifyMeaning = () => {
    modifymeaning.current.style.height = '5px';
    modifymeaning.current.style.height = modifymeaning.current.scrollHeight + 'px';
  };

  return (
    <div className="added-card draggable bg-color-white" style={{ marginBottom: '30px' }}>
      <div stlye={{ display: 'flex', backgroundColor: 'white' }}>
        <div className="div-card-index" style={{ display: 'flex', borderBottom: '1px solid lightgrey', marginBottom: '1rem' }}>
          <h3 style={{ alignSelf: 'center' }}>{card.idx + 1}번 카드</h3>
          {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}> */}
          <div style={{ marginLeft: 'auto' }}>
            {/* 카드수정 및 저장버튼 삼항연산자 */}
            {card.isEditing ? (
              <MaterialButton
                variant="text"
                style={{ fontWeight: '800' }}
                color={'primary'}
                onClick={() => {
                  //수정 console.log('cards : ', cards);
                  //수정 console.log('card : ', card);
                  //수정 console.log('card.idx : ', card.idx);

                  const found = cards.find((ccard) => ccard.idx != card.idx && (ccard.word == modifyword.current.value || ccard.meaning == modifymeaning.current.value));
                  if (found != undefined) {
                    alert('중복된 단어나 뜻이 이미 세트에 존재합니다.');
                    return;
                  }

                  //수정 console.log(modifyword.current.value);
                  //수정 console.log(modifymeaning.current.value);
                  card.word = modifyword.current.value;
                  card.meaning = modifymeaning.current.value;
                  onSave(card);
                }}
              >
                <FiSave size="32" />
                저장하기
              </MaterialButton>
            ) : (
                <MaterialButton
                  variant="text"
                  style={{ fontWeight: '800' }}
                  color={'primary'}
                  onClick={() => {
                    //수정 console.log('edit button clicked.');
                    onEdit(card.idx);
                  }}
                >
                  <FiEdit2 size="32" />
                수정하기
                </MaterialButton>
              )}
            {/* 삼항연산자 끝 */}

            {/* 카드삭제버튼 */}
            <MaterialButton
              variant="text"
              style={{ fontWeight: '800' }}
              color={'secondary'}
              onClick={() => {
                onDelete(card.idx);
              }}
            >
              <FiTrash2 size="32" />
              삭제하기
            </MaterialButton>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', padding: '1rem' }}>
          <div className="mx-3" style={{ width: '40%' }}>
            <span className="word">단어</span>
            {card.isEditing && (
              <Form.Control
                className="inputbox"
                as="textarea"
                placeholder={card.word}
                ref={modifyword}
                defaultValue={card.word}
                style={{ fontSize: '20px', borderRadius: 0 }}
                onKeyUp={handleModifyWord}
              />
            )}
            {!card.isEditing && (
              <pre style={{ borderBottom: '5px solid black', wordBreak: 'break-all', overflowX: 'hidden', whiteSpace: 'pre-wrap' }}>
                <span style={{ fontSize: '20px' }}>{card.word}</span>
              </pre>
            )}
          </div>
          <div className="mx-3" style={{ width: '60%' }}>
            <span className="descpription">뜻</span>
            {card.isEditing && (
              <Form.Control
                className="inputbox"
                as="textarea"
                placeholder={card.meaning}
                ref={modifymeaning}
                defaultValue={card.meaning}
                style={{ fontSize: '20px', borderRadius: 0 }}
                onKeyUp={handleModifyMeaning}
              />
            )}
            {!card.isEditing && (
              <pre style={{ borderBottom: '5px solid black', wordBreak: 'break-all', overflowX: 'hidden', whiteSpace: 'pre-wrap' }}>
                <span style={{ fontSize: '20px' }}>{card.meaning}</span>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetModifyPage;
