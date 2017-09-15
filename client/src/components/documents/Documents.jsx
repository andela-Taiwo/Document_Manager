import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as userRequestAction from '../../Api/docManagerAPI';

class AllDocuments extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {documents: [],
  };
  }
  componentWillMount() {

    const userToken = localStorage.getItem('userToken');
    console.log('retyuiwoppewewuiewiiwiiiuwiuiwi',userToken)
    this.props.getDocuments();
  }
  render(){
    console.log('this is document props', this.props);
    let returnedDocuments = 0;
    if(this.props.documents[0]){
      console.log('this is document data', this.props.documents[0].data);
      const { data } = this.props.documents[0];
      returnedDocuments = data.documents;
      console.log(returnedDocuments);
    }
    return(
      <div className="card-panel">
            <h3 className="text-center"> Documents</h3>

      <div className="">
        <ul className="documentList" >
         {returnedDocuments.length>0 && returnedDocuments.map(document => (
            <div key={document.id}>
              <li
                style={{
                  fontFamily: 'Andora',
                  fontSize: '24px'
                }}
              >
                  {document.title}
               </li>
               <li>
                  <Link to={{ pathname:`/dashboard/document/${document.id}`}}
                 className=""
                   >
                     {'Read...'} </Link>
               </li>
               <hr />
            </div>
         ))}

      </ul>
    </div>
</div>

    )
  }
}
function mapStateToProps(state) {
  return{documents: state.documents}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDocuments: (userToken) => dispatch(userRequestAction.getAllDocuments())
    };
};
// export default HomePage;
export default connect(mapStateToProps, mapDispatchToProps)(AllDocuments)
