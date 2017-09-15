import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as userRequestAction from '../../Api/docManagerAPI';

class AllDocuments extends React.Component{
  constructor(props){
  	super(props);
  	this.state = {documents: [],
                  documentId: this.props.params.id
    };
  }
  componentWillMount() {
    const userToken = localStorage.getItem('userToken');
    this.props.getDocuments();
  }
  render(){
    console.log('location',this.props.params.id);
    let returnedDocuments = 0;
    if(this.props.documents[0]){
      const { data } = this.props.documents[0];
      returnedDocuments = data.documents;

      console.log(returnedDocuments);
    }
    return(
      <div className="row">
        <div className="col s10 ">
   {returnedDocuments.length>0 && returnedDocuments.map(document => (
     <div key={document.id}>

         { (document.id === parseInt(this.state.documentId)) && <div className="row" ><div className="col s12 m8"><div className="card-panel"> <span className="">{document.content}
         </span></div></div></div> }
       </div>

   ))}


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
