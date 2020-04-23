import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api'

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState(null)
  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    }).catch(error => setError(error.message))
  }, [])


  async function handleLikeRepository(id) {

    api.post(`repositories/${id}/like`).then(response => {
      const updatedRepository = response.data;
      const repositoryIndex = repositories.findIndex( repo => repo.id == id);

      let updatedRepositories = [...repositories];
      updatedRepositories[repositoryIndex] = updatedRepository;
      setRepositories(updatedRepositories);
    })
  }

  if (repositories.length == 0) {
    const message = error ? `Error on try fetch repositories: ${error}` : 'No repositories :('
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.buttonText}>{message}</Text>
      </View>
    )

  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => renderItem(item, handleLikeRepository )}
        />
      </SafeAreaView>
    </>
  );

}

const renderItem = (repository, handleLikeRepository) => {
  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{repository.title}</Text>

      <View style={styles.techsContainer}>
        {repository.techs.map(tech => <Text key={tech} style={styles.tech}>{tech}</Text>)}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${repository.id}`}
        >
          {repository.likes} curtidas
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(repository.id)}
        testID={`like-button-${repository.id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },

  messageContainer: {
    flex: 1,
    backgroundColor: "#7159c1",
    justifyContent: 'center',
    alignItems: 'center'
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
