import { Calendar, ExternalLink, Phone, Settings2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// Logos importieren (Namen und Pfade ggf. anpassen)
import appleHealthLogo from './assets/logos/applehealth.png';
import garminLogo from './assets/logos/garmin.png';
import runnaLogo from './assets/logos/runna.png';
import stravaLogo from './assets/logos/strava.png';
import whoopLogo from './assets/logos/whoop.png';
import zwiftLogo from './assets/logos/zwift.png';

interface AuthForm {
  phoneNumber: string;
  dateOfBirth: string;
}

interface Integration {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  description: string;
  comingSoon?: boolean; // Flag für "Coming Soon"
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState<AuthForm>({
    phoneNumber: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState<string>('');

  // Beispiel-Integrationsliste
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Whoop',
      logo: whoopLogo,
      connected: false,
      description: 'Track your recovery and daily strain',
    },
    {
      id: '2',
      name: 'Apple Health',
      logo: appleHealthLogo,
      connected: false,
      description: 'Sync your health and fitness data',
    },
    {
      id: '3',
      name: 'Strava',
      logo: stravaLogo,
      connected: false,
      description: 'Connect your running and cycling activities',
    },
    {
      id: '4',
      name: 'Garmin',
      logo: garminLogo,
      connected: false,
      comingSoon: true,
      description: 'Monitor your sports activities and performance',
    },
    {
      id: '5',
      name: 'Zwift',
      logo: zwiftLogo,
      connected: false,
      comingSoon: true,
      description: 'Connect for indoor cycling and virtual training',
    },
    {
      id: '6',
      name: 'Runna',
      logo: runnaLogo,
      connected: false,
      comingSoon: true,
      description: 'Seamlessly track your running workouts',
    },
  ]);

  // Eingaben in den Formularfeldern aktualisieren
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Login-Logik (Abgleich mit Supabase)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basisvalidierung
    if (!authForm.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number');
      return;
    }
    if (!authForm.dateOfBirth) {
      setError('Please enter a date of birth');
      return;
    }

    const birthDate = new Date(authForm.dateOfBirth);
    const today = new Date();
    if (birthDate >= today) {
      setError('Please enter a valid date of birth');
      return;
    }

    // Datumsformat "YYYY-MM-DD"
    const formattedDate = birthDate.toISOString().split('T')[0];

    // Supabase-Abfrage an "stammdaten"
    const { data, error: supaError } = await supabase
      .from('stammdaten')
      .select('*')
      .eq('sender', authForm.phoneNumber)
      .eq('geburtsdatum', formattedDate)
      .single();

    if (supaError) {
      setError('No matching user found');
      console.error(supaError);
      return;
    }

    // Erfolgreicher Login
    setIsAuthenticated(true);
  };

  // Wenn nicht eingeloggt, zeige Login-Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#FFFAFA] flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-[#1A1A1A] p-8 shadow-lg">
          <div className="flex items-center mb-8">
            <Settings2 className="w-8 h-8 text-[#9DC183]" />
            <h1 className="ml-3 text-xl font-semibold">Integrations Dashboard</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={authForm.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border-gray-700 focus:border-[#9DC183] border focus:ring-2 focus:ring-[#9DC183] focus:ring-opacity-50"
                />
              </div>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={authForm.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border-gray-700 focus:border-[#9DC183] border focus:ring-2 focus:ring-[#9DC183] focus:ring-opacity-50"
                />
              </div>
            </div>
            {/* Fehleranzeige */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#9DC183] text-white py-2 px-4 rounded-lg hover:bg-[#8CAF72] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9DC183] focus:ring-opacity-50"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard-Inhalt nach erfolgreichem Login
  return (
    <div className="min-h-screen bg-[#121212] text-[#FFFAFA]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Settings2 className="w-8 h-8 text-[#9DC183]" />
            <h1 className="text-xl font-semibold">Integration Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-lg bg-[#1A1A1A] p-6 shadow-sm hover:bg-[#222222] transition-colors duration-200"
            >
              <div className="flex flex-col items-center space-y-4">
                {/* Logo */}
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-16 h-8 object-contain"
                />
                <div className="text-center">
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-400">{integration.description}</p>
                </div>
                {/* Connect-Button oder "Coming Soon" */}
                {integration.comingSoon ? (
                  <div className="w-full text-center py-2 rounded-lg bg-gray-700 text-sm">
                    Coming Soon
                  </div>
                ) : integration.connected ? (
                  <button className="p-2 rounded-lg hover:bg-gray-800">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                ) : (
                  <button className="flex items-center justify-center w-full px-3 py-2 rounded-lg bg-[#9DC183] text-white hover:bg-[#8CAF72] transition-colors duration-200">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Connect</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
