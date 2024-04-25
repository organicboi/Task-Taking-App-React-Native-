/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {database} from '../model/Database';
import DropDownPicker from 'react-native-dropdown-picker';
import '../assets/fonts/Cairo Regular.ttf';

const MainForm = () => {
  const [showCard, setShowCard] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [fetchedTask, setFetchedTask] = useState([]);
  const [editMenuId, setEditMenuId] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Low', value: 'low'},
    {label: 'Medium', value: 'medium'},
    {label: 'High', value: 'high'},
    {label: 'MaxPriority', value: 'maxPriority'},
  ]);
  const [showCreateNewNoteBar, setShowCreateNewNoteBar] = useState(true);
  const [type, setType] = useState('new');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (editMenuId) {
      const timer = setTimeout(() => {
        setEditMenuId(null);
      }, 5000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer);
    }
  }, [editMenuId]);

  const getTasks = () => {
    const taskData = database.collections.get('tasks');

    taskData
      .query()
      .observe()
      .forEach(item => {
        let temp = [];
        item.forEach(data => {
          temp.push(data._raw);
        });

        setFetchedTask(temp);
      });
  };

  const addNewTask = async () => {
    if (!taskTitle) {
      Alert.alert('Task title cannot be empty');
      return;
    }

    database.write(async () => {
      await database.get('tasks').create(task => {
        task.title = taskTitle;
        task.desc = taskDesc;
        task.priority = value;
      });
    });

    setShowCard(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('');
    getTasks();
    setValue('');
    setShowCreateNewNoteBar(true);
    // setType('new');
  };

  const deleteTask = async id => {
    database.write(async () => {
      const task = await database.get('tasks').find(id);
      await task.destroyPermanently();
      getTasks();
      setShowEditMenu(false);
      // setShowCreateNewNoteBar(true);
    });
  };

  const updateTask = async id => {
    await database.write(async () => {
      const task = await database.get('tasks').find(selectedId);
      await task.update(item => {
        item.title = taskTitle;
        item.desc = taskDesc;
        item.priority = value;
      });
      setType('new');
      setTaskTitle('');
      setTaskDesc('');
      setValue('');
      setShowCard(false);
      setShowCreateNewNoteBar(true);
    });
  };

  const getColorForPriority = priority => {
    const priorityColors = {
      low: 'green',
      medium: 'orange',
      high: 'red',
      maxPriority: 'purple',
    };

    return priorityColors[priority] || 'black';
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fa8569'}}>
      <View style={styles.headingView}>
        <Text style={styles.headingtext}>Task Taking App</Text>
      </View>
      {showCard && (
        <View
          style={{
            width: '90%',
            paddingBottom: 20,
            backgroundColor: '#F8F6E3',
            shadowColor: 'green',
            elevation: 6,
            shadowOpacity: 0.5,
            alignSelf: 'center',
            padding: 10,
            marginTop: 20,
            borderRadius: 8,
          }}>
          <TextInput
            placeholder="Enter Task title"
            placeholderTextColor={'gray'}
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              borderColor: '#F2613F',
              color: 'black',
            }}
            value={taskTitle}
            onChangeText={txt => {
              setTaskTitle(txt);
            }}
          />
          <TextInput
            placeholder="Enter Task Desc"
            placeholderTextColor={'gray'}
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              borderColor: '#F2613F',
              color: 'black',
            }}
            value={taskDesc}
            onChangeText={txt => {
              setTaskDesc(txt);
            }}
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{
              width: '90%',
              height: 50,
              borderWidth: 0.5,
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              borderRadius: 0,
              backgroundColor: '#F8F6E3',
              borderColor: '#F2613F',
            }}
            dropDownContainerStyle={{
              width: '90%',
              borderWidth: 1,
              borderColor: '#F2613F',
              alignSelf: 'center',
              marginTop: 20,
              paddingLeft: 20,
              borderRadius: 0,
              backgroundColor: '#F8F6E3',
            }}
            textStyle={{
              color: 'gray',
            }}
            labelStyle={{
              color: 'black',
            }}
          />
          <TouchableOpacity
            style={{
              width: '100%',
              marginTop: 20,
              height: 50,
              borderRadius: 11,
              backgroundColor: '#F2613F',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (type == 'new') {
                addNewTask();
              } else {
                updateTask();
              }
            }}>
            <Text
              style={{
                color: '#F8F6E3',
                fontWeight: 'bold',
              }}>
              {type === 'edit' ? 'Update Note' : 'Create New Note'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '100%',
              marginTop: 20,
              height: 50,
              borderRadius: 11,
              borderWidth: 1,
              borderColor: '#F2613F',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowCard(false);
              setShowCreateNewNoteBar(true);
              setValue('');
              setTaskDesc('');
              setTaskTitle('');
              setType('new');
            }}>
            <Text
              style={{
                color: '#F2613F',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchedTask.sort((a, b) => {
          const priorityOrder = {
            maxPriority: 4,
            high: 3,
            medium: 2,
            low: 1,
          };

          const priorityValueA = a.priority ? priorityOrder[a.priority] : 0;
          const priorityValueB = b.priority ? priorityOrder[b.priority] : 0;

          return priorityValueB - priorityValueA;
        })}
        style={{margin: 10}}
        renderItem={({item, index}) => {
          const priorityOrder = {
            maxPriority: 4,
            high: 3,
            medium: 2,
            low: 1,
          };

          const priorityValue = item.priority
            ? priorityOrder[item.priority]
            : 0;

          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  setEditMenuId(item.id);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '95%',
                    alignSelf: 'center',
                    borderWidth: 0,
                    backgroundColor: '#F8F6E3',
                    marginBottom: 10,
                    padding: 15,
                    borderRadius: 11,
                    elevation: 3,
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        marginBottom: 6,
                        fontSize: 18,
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        marginBottom: 15,
                        color: 'gray',
                      }}>
                      {item.desc}
                    </Text>
                    <Text
                      style={{
                        color: getColorForPriority(item.priority),
                      }}>
                      Priority: {item.priority}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {editMenuId === item.id && (
                <View
                  style={{
                    width: '60%',

                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignSelf: 'center',
                    backgroundColor: '#F8F6E3',
                    marginBottom: 10,
                    paddingVertical: 6,
                    borderRadius: 11,
                    elevation: 3,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCreateNewNoteBar(false);

                      setType('edit');
                      setTaskTitle(item.title);
                      setTaskDesc(item.desc);
                      setSelectedId(item.id);
                      setValue(item.priority);
                      setShowCard(true);
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'green',
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      deleteTask(item.id);
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'red',
                      }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          );
        }}
      />
      {showCreateNewNoteBar && (
        <TouchableOpacity
          style={styles.addNewNoteTouchable}
          onPress={() => {
            setShowCard(true);
            setShowCreateNewNoteBar(false);
          }}>
          <Text
            style={{
              color: '#F2613F',
              fontWeight: 'bold',
              fontSize: 21,
              marginLeft: 13,
            }}>
            Create New Note
          </Text>
          <Image
            style={{width: 28, height: 28}}
            source={require('../images/add.png')}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default MainForm;

const styles = StyleSheet.create({
  headingView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F8F6E3',
  },
  headingtext: {
    fontWeight: '900',
    fontSize: 25,
    color: '#F2613F',
    fontFamily: 'cursive',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  alert: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 9,
    alignItems: 'center',
    elevation: 4,
  },
  alertText: {
    color: 'white',
  },
  addNewNoteTouchable: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 100 / 2,
    backgroundColor: '#F8F6E3',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
