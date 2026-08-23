import React, {useMemo, useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native';

type Filter = 'All' | 'Active' | 'Done';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const starterTodos: Todo[] = [
  {id: '1', title: 'Plan a focused mornin', completed: true},
  {id: '2', title: 'Finish the project brief', completed: false},
  {id: '3', title: 'Take a 15-minute walk', completed: false},
];

function App(): React.JSX.Element {
  const [todos, setTodos] = useState<Todo[]>(starterTodos);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filter === 'Active') {
          return !todo.completed;
        }
        if (filter === 'Done') {
          return todo.completed;
        }
        return true;
      }),
    [filter, todos],
  );

  const addTodo = () => {
    const title = draft.trim();
    if (!title) {
      return;
    }

    setTodos(current => [
      {id: String(Date.now()), title, completed: false},
      ...current,
    ]);
    setDraft('');
    Keyboard.dismiss();
  };

  const toggleTodo = (id: string) => {
    setTodos(current =>
      current.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo,
      ),
    );
  };

  const removeTodo = (id: string) => {
    setTodos(current => current.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    if (!completedCount) {
      return;
    }
    Alert.alert('Clear completed tasks?', 'This will remove completed tasks.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => setTodos(current => current.filter(todo => !todo.completed)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TODAY</Text>
            <Text style={styles.title}>My tasks</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countNumber}>{activeCount}</Text>
            <Text style={styles.countLabel}>left</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressTitle}>Your daily rhythm</Text>
            <Text style={styles.progressText}>
              {completedCount === 0
                ? 'Start small. One task at a time.'
                : `${completedCount} task${completedCount === 1 ? '' : 's'} complete — nice work.`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%`},
              ]}
            />
          </View>
        </View>

        <View style={styles.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addTodo}
            placeholder="What needs to be done?"
            placeholderTextColor="#8B8FA3"
            returnKeyType="done"
            style={styles.input}
          />
          <Pressable
            accessibilityLabel="Add task"
            onPress={addTodo}
            style={({pressed}) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Active', 'Done'] as Filter[]).map(item => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filter, filter === item && styles.filterSelected]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>
                {item}
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={clearCompleted} hitSlop={8} style={styles.clearButton}>
            <Text style={[styles.clearText, !completedCount && styles.clearTextDisabled]}>
              Clear done
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={visibleTodos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.todoCard}>
              <Pressable
                accessibilityLabel={`Mark ${item.title} as ${item.completed ? 'active' : 'complete'}`}
                onPress={() => toggleTodo(item.id)}
                style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Pressable onPress={() => toggleTodo(item.id)} style={styles.todoTextWrap}>
                <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
                  {item.title}
                </Text>
              </Pressable>
              <Pressable
                accessibilityLabel={`Delete ${item.title}`}
                onPress={() => removeTodo(item.id)}
                hitSlop={10}
                style={styles.deleteButton}>
                <Text style={styles.deleteText}>×</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✦</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>Add a task or switch filters to see more.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F7F7FB'},
  container: {flex: 1, paddingHorizontal: 20},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 22},
  eyebrow: {fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: '#777B91'},
  title: {fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -1, color: '#20213A'},
  countPill: {width: 58, height: 58, borderRadius: 18, backgroundColor: '#E8E7FF', alignItems: 'center', justifyContent: 'center'},
  countNumber: {fontSize: 20, fontWeight: '800', color: '#5854D6', lineHeight: 22},
  countLabel: {fontSize: 10, fontWeight: '700', color: '#6764C1'},
  progressCard: {backgroundColor: '#242344', borderRadius: 20, padding: 20, marginBottom: 18},
  progressTitle: {color: '#FFF', fontSize: 16, fontWeight: '800'},
  progressText: {color: '#BBBBD0', fontSize: 13, marginTop: 4},
  progressTrack: {height: 7, backgroundColor: '#414064', borderRadius: 6, overflow: 'hidden', marginTop: 16},
  progressFill: {height: '100%', borderRadius: 6, backgroundColor: '#9B97FF'},
  addRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18},
  input: {flex: 1, height: 54, borderRadius: 16, backgroundColor: '#FFF', paddingHorizontal: 17, color: '#242344', fontSize: 15, shadowColor: '#292842', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: {width: 0, height: 3}, elevation: 2},
  addButton: {width: 54, height: 54, backgroundColor: '#5B57D9', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#4E49BF', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 3},
  addButtonText: {fontSize: 30, lineHeight: 33, color: '#FFF', fontWeight: '300'},
  pressed: {opacity: 0.78, transform: [{scale: 0.97}]},
  filterRow: {height: 38, flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  filter: {paddingVertical: 7, paddingHorizontal: 11, borderRadius: 10, marginRight: 3},
  filterSelected: {backgroundColor: '#E4E3FF'},
  filterText: {fontSize: 13, color: '#777B91', fontWeight: '700'},
  filterTextSelected: {color: '#5652CC'},
  clearButton: {marginLeft: 'auto', padding: 7},
  clearText: {fontSize: 12, color: '#E06B6B', fontWeight: '700'},
  clearTextDisabled: {color: '#C7C7D0'},
  list: {paddingTop: 3, paddingBottom: 28},
  todoCard: {minHeight: 67, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginVertical: 5, borderRadius: 17, backgroundColor: '#FFF', shadowColor: '#242344', shadowOpacity: 0.055, shadowRadius: 10, shadowOffset: {width: 0, height: 3}, elevation: 2},
  checkbox: {width: 23, height: 23, borderRadius: 8, borderWidth: 2, borderColor: '#C9C9D6', alignItems: 'center', justifyContent: 'center'},
  checkboxChecked: {borderColor: '#5B57D9', backgroundColor: '#5B57D9'},
  checkmark: {color: '#FFF', fontWeight: '900', fontSize: 15, marginTop: -1},
  todoTextWrap: {flex: 1, paddingHorizontal: 13, paddingVertical: 15},
  todoText: {fontSize: 15, fontWeight: '600', color: '#303047'},
  todoTextCompleted: {color: '#A0A1AF', textDecorationLine: 'line-through'},
  deleteButton: {width: 24, height: 28, alignItems: 'center', justifyContent: 'center'},
  deleteText: {fontSize: 23, lineHeight: 25, color: '#B6B6C2', fontWeight: '300'},
  emptyState: {alignItems: 'center', paddingTop: 60},
  emptyEmoji: {fontSize: 29, color: '#7774DF'},
  emptyTitle: {fontSize: 17, fontWeight: '800', color: '#36364C', marginTop: 10},
  emptyText: {fontSize: 13, color: '#8B8B9A', marginTop: 4},
});

export default App;
