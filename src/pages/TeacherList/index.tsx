import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [subject, setsubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFilterSubmit() {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });

        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton>
                        <Feather
                            name='filter'
                            size={20}
                            color="#FFF"
                            onPress={handleToggleFiltersVisible}
                        />
                    </BorderlessButton>
                )}
            >
                {isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>
                            Matéria
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor='#C1BCCC'
                            value={subject}
                            onChangeText={text => setsubject(text)}
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>
                                    Dia da semana
                                            </Text>
                                <TextInput
                                    placeholderTextColor='#C1BCCC'
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>
                                    Horário
                                </Text>
                                <TextInput
                                    placeholderTextColor='#C1BCCC'
                                    style={styles.input}
                                    placeholder="Qual horário?"
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                />
                            </View>
                        </View>

                        <RectButton
                            style={styles.submitButton}
                            onPress={handleFilterSubmit}
                        >
                            <Text style={styles.submitButtonText}>Filtar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;