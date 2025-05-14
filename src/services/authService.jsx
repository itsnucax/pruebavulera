
    import React from "react";
    import { supabase } from '@/lib/supabaseClient.jsx';

    const generateDummyEmail = (identifier) => `${identifier}@easyphone.app`;

    export const fetchSessionProfile = async (session) => {
      if (!session || !session.user) return null;

      const { data: clientProfile, error: profileError } = await supabase
        .from('easyphone_app_clients')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching client profile:', profileError);
        throw new Error('Error al cargar el perfil del usuario.');
      }
      
      if (clientProfile) {
        return { 
          id: session.user.id, 
          ...clientProfile, 
          type: clientProfile.client_identifier === 'admin' ? 'admin' : 'client' 
        };
      }
      
      if (session.user.email === generateDummyEmail('admin')) {
         const { data: adminData, error: adminDataError } = await supabase
          .from('easyphone_app_clients')
          .select('*')
          .eq('client_identifier', 'admin')
          .single();
        if (adminData) {
            return { id: session.user.id, ...adminData, type: 'admin' };
        }
      }
      return null;
    };

    export const performClientLogin = async (clientIdentifier, password) => {
      const { data: client, error: clientError } = await supabase
        .from('easyphone_app_clients')
        .select('id, client_identifier')
        .eq('client_identifier', clientIdentifier)
        .single();

      if (clientError || !client) {
        throw new Error('ID de cliente o contraseña incorrectos.');
      }
      
      const dummyEmail = generateDummyEmail(client.client_identifier);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: dummyEmail, 
        password: password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
             throw new Error('ID de cliente o contraseña incorrectos.');
        }
        throw signInError;
      }
      
      if (data.user && data.session) {
         const userType = client.client_identifier === 'admin' ? 'admin' : 'client';
         const { data: fullClientProfile } = await supabase.from('easyphone_app_clients').select('*').eq('id', data.user.id).single();
         return { ...data.user, ...fullClientProfile, type: userType };
      }
      throw new Error('No se pudo iniciar sesión.');
    };

    export const performClientRegistration = async (userData) => {
      const { client_identifier, password, full_name, phone, address } = userData;

      const { data: existingClientByIdentifier } = await supabase
        .from('easyphone_app_clients')
        .select('client_identifier')
        .eq('client_identifier', client_identifier)
        .single();

      if (existingClientByIdentifier) {
        throw new Error('El ID de cliente ya está en uso.');
      }
      
      const dummyEmail = generateDummyEmail(client_identifier);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (authData.user) {
        const { data: insertedProfile, error: profileError } = await supabase
          .from('easyphone_app_clients')
          .insert([
            { 
              id: authData.user.id, 
              client_identifier,
              password_hash: '-', 
              full_name, 
              phone, 
              address 
            }
          ])
          .select()
          .single();

        if (profileError) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`No se pudo crear el perfil: ${profileError.message}`);
        }
        return { ...authData.user, ...insertedProfile, type: 'client' };
      }
      throw new Error('No se pudo registrar el usuario.');
    };

    export const performAdminLogin = async (password) => {
      if (password !== 'MUN2025') {
        throw new Error('Contraseña de administrador incorrecta.');
      }

      const adminIdentifier = 'admin';
      const adminDummyEmail = generateDummyEmail(adminIdentifier);
      
      let { data: adminUser, error: adminUserError } = await supabase
        .from('easyphone_app_clients')
        .select('id, client_identifier')
        .eq('client_identifier', adminIdentifier)
        .single();

      if (!adminUser && adminUserError && adminUserError.code === 'PGRST116') {
         const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: adminDummyEmail,
            password: password, 
         });

         if (signUpError && signUpError.message !== "User already registered" && signUpError.message !== "Email rate limit exceeded") {
            throw new Error(`Error al crear cuenta de admin: ${signUpError.message}`);
         }
         
         const authUserId = signUpData?.user?.id || (await supabase.auth.admin.getUserByEmail(adminDummyEmail)).data.user?.id;

         if (!authUserId) {
            throw new Error('No se pudo obtener el ID de usuario del administrador.');
         }
         
        const { data: existingProfileCheck } = await supabase.from('easyphone_app_clients').select('id').eq('id', authUserId).single();

        if (!existingProfileCheck) {
            const { error: profileError } = await supabase
              .from('easyphone_app_clients')
              .insert([{ 
                  id: authUserId, 
                  client_identifier: adminIdentifier, 
                  password_hash: '-', 
                  full_name: 'Administrador' 
              }]);
            if (profileError) {
                throw new Error(`Error al crear perfil de admin: ${profileError.message}`);
            }
        }
        adminUser = { id: authUserId, client_identifier: adminIdentifier };

      } else if (adminUserError) {
        throw new Error(`Error al buscar admin: ${adminUserError.message}`);
      }
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminDummyEmail,
        password: password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
             throw new Error('Contraseña de administrador incorrecta.');
        }
        throw signInError;
      }
      if (data.user && data.session) {
        const { data: fullAdminProfile } = await supabase.from('easyphone_app_clients').select('*').eq('id', data.user.id).single();
        return { ...data.user, ...fullAdminProfile, type: 'admin' };
      }
      throw new Error('No se pudo iniciar sesión como administrador.');
    };

    export const performLogout = async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
    };

    export const performUpdateClientProfile = async (userId, profileData) => {
      const { email, ...restOfProfileData } = profileData; 
      const { data, error: updateError } = await supabase
        .from('easyphone_app_clients')
        .update(restOfProfileData)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        throw new Error(`No se pudo actualizar el perfil: ${updateError.message}`);
      }
      return data;
    };
  