/*
  Copyright 2023 FilmFestBook

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

//Third Party Components
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//Custom Components
import Session from "components/session";

//Screens
import FestivalScreens from "screens/festival/";
import WorkTypeScreen from "screens/workType";
import AccountScreens from "screens/account";
import HomeScreens from "screens/home";
import FilmScreens from "screens/film";

function App() {  
  return (
    <>
      <BrowserRouter>
        <Session>
          <Routes>
            <Route path="/home/*" element={<HomeScreens />} />
            <Route path="/work_type/*" element={<WorkTypeScreen />} /> 
            <Route path="/festival/*" element={<FestivalScreens />} /> 
            <Route path="/film/*" element={<FilmScreens />} />
            <Route path="/*" element={<AccountScreens />} />
          </Routes>
        </Session>
      </BrowserRouter>
      <Toaster containerStyle={{ fontFamily: 'sans-serif' }} />
    </>
  );
}

export default App;