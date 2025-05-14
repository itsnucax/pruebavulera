
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
      
      const adminDummyEmail = generateDummyEmail('admin');
      if (session.user.email === adminDummyEmail) {
         const { data: adminData, error: adminDataError } = await supabase
          .from('easyphone_app_clients')
          .select('*')
          .eq('client_identifier', 'admin')
          .single();

        if (adminDataError && adminDataError.code !== 'PGRST116') {
          console.error('Error fetching admin profile after session check:', adminDataError);
        }
        if (adminData) {
            return { id: session.user.id, ...adminData, type: 'admin' };
        }
      }
      return null;
    };

    export const performClientLogin = async (clientIdentifier, password) => {
      const dummyEmail = generateDummyEmail(clientIdentifier);
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: dummyEmail, 
        password: password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes("invalid login credentials")) {
             throw new Error('ID de cliente o contraseña incorrectos.');
        }
        console.error('Supabase SignIn Error:', signInError);
        throw new Error(`Error de inicio de sesión: ${signInError.message}`);
      }
      
      if (signInData.user && signInData.session) {
         const { data: clientProfile, error: clientProfileError } = await supabase
            .from('easyphone_app_clients')
            .select('*')
            .eq('id', signInData.user.id)
            .single();

        if (clientProfileError) {
            console.error('Error fetching client profile after login:', clientProfileError);
            await supabase.auth.signOut(); 
            throw new Error('No se pudo cargar el perfil del cliente después de iniciar sesión.');
        }
        
        if (!clientProfile) {
            await supabase.auth.signOut();
            throw new Error('Perfil de cliente no encontrado después de iniciar sesión.');
        }

         const userType = clientProfile.client_identifier === 'admin' ? 'admin' : 'client';
         return { ...signInData.user, ...clientProfile, type: userType };
      }
      throw new Error('No se pudo iniciar sesión. Respuesta inesperada del servidor.');
    };

    export const performClientRegistration = async (userData) => {
      const { client_identifier, password, full_name, phone, address } = userData;

      const { data: existingClientByIdentifier, error: existingClientError } = await supabase
        .from('easyphone_app_clients')
        .select('client_identifier')
        .eq('client_identifier', client_identifier)
        .maybeSingle();

      if(existingClientError && existingClientError.code !== 'PGRST116'){
          console.error("Error checking existing client by identifier:", existingClientError);
          throw new Error("Error al verificar el ID de cliente.");
      }
      if (existingClientByIdentifier) {
        throw new Error('El ID de cliente ya está en uso.');
      }
      
      const dummyEmail = generateDummyEmail(client_identifier);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
      });

      if (signUpError) {
        console.error('Supabase SignUp Error:', signUpError);
        if(signUpError.message.includes("User already registered")){
             throw new Error('Este ID de cliente (o su email asociado) ya está registrado en el sistema de autenticación.');
        }
        throw new Error(`Error de registro: ${signUpError.message}`);
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
          console.error('Error inserting profile:', profileError);
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`No se pudo crear el perfil: ${profileError.message}`);
        }
        return { ...authData.user, ...insertedProfile, type: 'client' };
      }
      throw new Error('No se pudo registrar el usuario. Respuesta inesperada del servidor.');
    };

    export const performAdminLogin = async (password) => {
      if (password !== 'MUN2025') {
        throw new Error('Contraseña de administrador incorrecta.');
      }

      const adminIdentifier = 'admin';
      const adminDummyEmail = generateDummyEmail(adminIdentifier);
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminDummyEmail,
        password: password,
      });

      if (signInError) {
         if (signInError.message.toLowerCase().includes("invalid login credentials")) {
            let { data: adminAuthUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(adminDummyEmail);

            if(getUserError && getUserError.status === 404) { // User does not exist in auth.users
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: adminDummyEmail,
                    password: password,
                });

                if (signUpError) {
                    console.error('Admin SignUp Error:', signUpError);
                    throw new Error(`No se pudo crear la cuenta de autenticación del admin: ${signUpError.message}`);
                }
                adminAuthUser = signUpData.user;

                const { data: existingProfile, error: profileCheckError } = await supabase
                    .from('easyphone_app_clients')
                    .select('id')
                    .eq('client_identifier', adminIdentifier)
                    .maybeSingle();
                
                if (profileCheckError && profileCheckError.code !== 'PGRST116') throw profileCheckError;

                if(!existingProfile) {
                    const { error: profileInsertError } = await supabase
                        .from('easyphone_app_clients')
                        .insert([{
                            id: adminAuthUser.id,
                            client_identifier: adminIdentifier,
                            password_hash: '-',
                            full_name: 'Administrador'
                        }]);
                    if (profileInsertError) {
                        await supabase.auth.admin.deleteUser(adminAuthUser.id);
                        throw new Error(`No se pudo crear el perfil del administrador: ${profileInsertError.message}`);
                    }
                } else if (existingProfile.id !== adminAuthUser.id) {
                  // This case might indicate an inconsistency if an admin profile exists with a different auth ID.
                  // For now, we proceed, but this could be flagged for review.
                  // Potentially update existingProfile.id to adminAuthUser.id if business logic allows.
                  console.warn("Admin profile ID mismatch with new auth user ID.");
                }


            } else if (getUserError) {
                console.error('Error fetching admin user by email:', getUserError);
                throw new Error('Error verificando administrador.');
            }
            // Retry sign-in after potential creation/verification
            const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
                email: adminDummyEmail,
                password: password,
            });
            if (retrySignInError) {
                console.error('Admin Retry SignIn Error:', retrySignInError);
                throw new Error('Contraseña de administrador incorrecta o error de sistema.');
            }
            if (retrySignInData.user && retrySignInData.session) {
                const { data: fullAdminProfile } = await supabase.from('easyphone_app_clients').select('*').eq('id', retrySignInData.user.id).single();
                return { ...retrySignInData.user, ...fullAdminProfile, type: 'admin' };
            }
         } else {
            console.error('Admin SignIn Error:', signInError);
            throw new Error(`Error de inicio de sesión admin: ${signInError.message}`);
         }
      }

      if (signInData && signInData.user && signInData.session) {
        const { data: fullAdminProfile, error: adminProfileError } = await supabase
          .from('easyphone_app_clients')
          .select('*')
          .eq('id', signInData.user.id)
          .single();

        if (adminProfileError) {
            console.error("Error fetching admin profile after successful login:", adminProfileError);
            await supabase.auth.signOut();
            throw new Error("No se pudo cargar el perfil del administrador después de iniciar sesión.");
        }
        if(!fullAdminProfile){
             await supabase.auth.signOut();
             throw new Error("Perfil de administrador no encontrado después de iniciar sesión.");
        }
        return { ...signInData.user, ...fullAdminProfile, type: 'admin' };
      }
      throw new Error('No se pudo iniciar sesión como administrador. Respuesta inesperada.');
    };

    export const performLogout = async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Supabase SignOut Error:', signOutError);
        throw new Error(`Error al cerrar sesión: ${signOutError.message}`);
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
        console.error('Supabase UpdateProfile Error:', updateError);
        throw new Error(`No se pudo actualizar el perfil: ${updateError.message}`);
      }
      return data;
    };
  