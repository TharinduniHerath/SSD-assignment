// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { oauthService } from '../../services/oauthService';
// import { useStateContext } from '../../contexts/NavigationContext';

// const OAuthSuccess = () => {
//   const navigate = useNavigate();
//   const { setUser } = useStateContext();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const handleOAuthSuccess = async () => {
//       try {
//         const { user } = await oauthService.getProfile();
//         setUser(user);
        
//         // Show success message for 2 seconds then redirect
//         setTimeout(() => {
//           navigate('/'); // Redirect to home page
//         }, 2000);
//       } catch (error) {
//         console.error('OAuth success handling failed:', error);
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     handleOAuthSuccess();
//   }, [setUser, navigate]);

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         flexDirection: 'column'
//       }}>
//         <h2>Completing Google Sign In...</h2>
//         <p>Please wait while we set up your account.</p>
//         <div style={{ 
//           border: '4px solid #f3f3f3',
//           borderTop: '4px solid #3498db',
//           borderRadius: '50%',
//           width: '50px',
//           height: '50px',
//           animation: 'spin 2s linear infinite',
//           margin: '20px'
//         }}></div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       display: 'flex', 
//       justifyContent: 'center', 
//       alignItems: 'center', 
//       height: '100vh',
//       flexDirection: 'column'
//     }}>
//       <h2 style={{ color: 'green' }}>✅ Successfully signed in with Google!</h2>
//       <p>Redirecting you to the home page...</p>
//     </div>
//   );
// };

// export default OAuthSuccess;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthService } from '../../services/oauthService';
import { useStateContext } from '../../contexts/NavigationContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        console.log('OAuthSuccess: Starting OAuth success handling...');
        
        // Wait a bit to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await oauthService.getProfile();
        console.log('OAuthSuccess: Profile response:', response);
        
        if (response.user) {
          console.log('OAuthSuccess: Setting user:', response.user);
          setUser(response.user);
          
          // Show success message for 2 seconds then redirect
          setTimeout(() => {
            console.log('OAuthSuccess: Redirecting to home...');
            navigate('/');
          }, 2000);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [setUser, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#4285F4', marginBottom: '20px' }}>
            Completing Google Sign In...
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Please wait while we set up your account.
          </p>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4285F4',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          ✅
        </div>
        <h2 style={{ color: '#28a745', marginBottom: '20px' }}>
          Successfully signed in with Google!
        </h2>
        <p style={{ color: '#666' }}>
          Redirecting you to the home page...
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;