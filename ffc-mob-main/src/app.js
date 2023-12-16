import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import TabBar from 'components/tabBar';
import AppModeSwitcher from 'components/appModeSwitcher';

// Screens
import RegisterScreen from 'screens/account/register';
import LoginScreen from 'screens/account/login';
import GetStartedScreen from 'screens/account/getStarted';
import EmptyScreen from 'screens/empty';

// Home Tab Screens
import HomeScreen from 'screens/home';
import HomeFilmMakerScreen from 'screens/home/filmMaker';

// Festival Screens
import FestivalView from 'screens/festival/view';
import FestivalVenue from 'screens/festival/view/venue/';
import FestivalList from 'screens/festival/list';
import FestivalPhotos from 'screens/festival/photos';
import FestivalCreate from 'screens/festival/create';
import FestivalDetails from 'screens/festival/create/festivalDetails';
import FestivalContact from 'screens/festival/create/contactVenue';
import FestivalDeadline from 'screens/festival/create/dateDeadline';
import FestivalCategory from 'screens/festival/create/categoryDetails';
import FestivalListing from 'screens/festival/create/listingSettings';
import FestivalSubmissions from 'screens/festival/submissions';

// Manage Festival
import ManageFestival from 'screens/festival/manage';
import FestivalButtonLogo from 'screens/festival/manage/buttonAndLogo';
import FestivalNotification from 'screens/festival/manage/notificationManager';
import FestivalJudge from 'screens/festival/manage/judge';
import FestivalFlag from 'screens/festival/manage/flags';

// Film Screens
import FilmCreate from 'screens/film/create';
import FilmDetails from 'screens/film/create/filmDetails';
import FilmSubmitter from 'screens/film/create/submitterInfo';
import FilmCredits from 'screens/film/create/creditInfo';
import FilmSpecifications from 'screens/film/create/specification';
import FilmScreenings from 'screens/film/create/screenings';
import FilmView from 'screens/film/view';
import FilmSubmissions from 'screens/film/submissions';
import FilmPhotos from 'screens/film/photos';

// Dashboard Screens
import Dashboard from 'screens/dashboard';

// Cart Screens
import CartScreen from 'screens/cart';

// Message Screens
import MessageScreen from 'screens/message';
import ChatScreen from 'screens/chat/Messages';

// Notification Screens
import NotificationScreen from 'screens/notifications/';

// Profile Screen
import ProfileScreen from 'screens/profile/';
import EditProfile from 'screens/profile/edit';

// Functions
import Tinode from 'libs/tinode';

// Constants
import { TINODE_URL } from 'utils/constants';
import { DarkTheme, LightTheme } from 'themes/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeOrganizer = () => {
	const renderTabBar = (props) => <TabBar {...props} />;
	return (
		<Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Festivals" component={FestivalList} />
			<Tab.Screen name="Messages" component={MessageScreen} />
			<Tab.Screen name="Notifications" component={NotificationScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
};

const HomeFilmMaker = () => {
	const renderTabBar = (props) => <TabBar {...props} />;
	return (
		<Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
			<Tab.Screen name="Home" component={HomeFilmMakerScreen} />
			<Tab.Screen name="Festivals" component={FestivalList} />
			<Tab.Screen name="Messages" component={MessageScreen} />
			<Tab.Screen name="Notifications" component={NotificationScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
};

const App = () => {
	const [currentScheme, setCurrentScheme] = useState('light');
	const [currentTheme, setCurrentTheme] = useState(DarkTheme);
	useEffect(() => {
		const isDark = currentScheme === 'dark';
		const theme = isDark ? DarkTheme : LightTheme;
		const barStyle = isDark ? 'light-content' : 'dark-content';
		StatusBar.setBarStyle(barStyle);
		StatusBar.setHidden(false);
		StatusBar.setTranslucent(true);
		StatusBar.setBackgroundColor('transparent');
		setCurrentTheme(theme);
		Tinode.setHost(TINODE_URL);
	}, [currentScheme]);
	return (
		<>
			<NavigationContainer theme={currentTheme}>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
						<Stack.Screen name="GetStarted" component={GetStartedScreen} />
						<Stack.Screen name="HomeOrganizer" component={HomeOrganizer} />
						<Stack.Screen name="HomeFilmMaker" component={HomeFilmMaker} />
						<Stack.Screen name="FestivalView" component={FestivalView} />
						<Stack.Screen name="FestivalPhotos" component={FestivalPhotos} />
						<Stack.Screen name="FestivalVenue" component={FestivalVenue} />
						<Stack.Screen name="FestivalCreate" component={FestivalCreate} />
						<Stack.Screen name="FestivalDetails" component={FestivalDetails} />
						<Stack.Screen name="FestivalContact" component={FestivalContact} />
						<Stack.Screen
							name="FestivalCategory"
							component={FestivalCategory}
						/>
						<Stack.Screen
							name="FestivalDeadline"
							component={FestivalDeadline}
						/>
						<Stack.Screen name="FestivalListing" component={FestivalListing} />
						<Stack.Screen
							name="FestivalSubmissions"
							component={FestivalSubmissions}
						/>
						<Stack.Screen name="ManageFestival" component={ManageFestival} />
						<Stack.Screen
							name="FestivalButtonLogo"
							component={FestivalButtonLogo}
						/>
						<Stack.Screen
							name="FestivalNotification"
							component={FestivalNotification}
						/>
						<Stack.Screen name="FestivalJudge" component={FestivalJudge} />
						<Stack.Screen name="FestivalFlag" component={FestivalFlag} />

						<Stack.Screen name="FilmCreate" component={FilmCreate} />
						<Stack.Screen name="FilmDetails" component={FilmDetails} />
						<Stack.Screen name="FilmSubmitter" component={FilmSubmitter} />
						<Stack.Screen name="FilmCredits" component={FilmCredits} />
						<Stack.Screen
							name="FilmSpecifications"
							component={FilmSpecifications}
						/>
						<Stack.Screen name="FilmScreenings" component={FilmScreenings} />
						<Stack.Screen name="FilmView" component={FilmView} />
						<Stack.Screen name="FilmPhotos" component={FilmPhotos} />
						<Stack.Screen name="CartScreen" component={CartScreen} />
						<Stack.Screen name="FilmSubmissions" component={FilmSubmissions} />
						<Stack.Screen name="Dashboard" component={Dashboard} />
						<Stack.Screen name="ChatScreen" component={ChatScreen} />
						<Stack.Screen name="EditProfile" component={EditProfile} />						
					</Stack.Group>
					<Stack.Group screenOptions={{ animation: 'slide_from_bottom' }}>
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</Stack.Group>
				</Stack.Navigator>
			</NavigationContainer>
			<AppModeSwitcher onChange={setCurrentScheme} />
		</>
	);
};

export default App;