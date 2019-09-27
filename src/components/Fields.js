import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import ReactTable from 'react-table'

class Fields extends React.Component {

  render () {
    const { fields } = this.props;
    const { info } = this.props;
    const columns = [
      {
        Header: 'Field',
        accessor: 'name',
      },
      {
        Header: 'Field description',
        accessor: 'type',
        Cell: props => {
          if(props.original.type === 'Array' || props.original.type === 'Link') {
            if(info.children.length !== 0) {
              return (
                <span className='number'>descrizione di un field con CHILD:
                {' '}
                { info.children.map((x, index) => {
                  if(x.id === props.original.id) {
                    return (
                      <span className='number' key={ index }>
                        <Link to={ `/${x.name}` }>{ x.name }</Link>
                        {' '}
                      </span>
                    )

                  }
                  return ''
                }) }
                </span>
              )
            }
          }
          return <span className='number'>descrizione di un field SENZA CHILD</span>
        }
      }
    ];

    return (
      <ReactTable
        showPagination={ false }
        loading={ fields ? false : true }
        columns={ columns }
        minRows={ fields ? fields.length : 0 }
        data={ fields }
      />
    )
  }
}

export default withRouter(Fields);
