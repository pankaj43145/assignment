import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  TextInput,
  FlatList,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/tasks', {
      headers: {Authorization: token},
    });
    setTasks(response.data);
  };

  const addTask = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/tasks',
      {title, description},
      {
        headers: {Authorization: token},
      },
    );
    fetchTasks();
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const token = await AsyncStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      {completed: !completed},
      {
        headers: {Authorization: token},
      },
    );
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: {Authorization: token},
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>
              {item.title} - {item.completed ? 'Completed' : 'Pending'}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Toggle"
                onPress={() => toggleTask(item._id, item.completed)}
              />
              <Button title="Delete" onPress={() => deleteTask(item._id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  taskContainer: {
    marginBottom: 15,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  taskText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TodoScreen;
