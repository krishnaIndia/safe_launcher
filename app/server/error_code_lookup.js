/* eslint-disable import/prefer-default-export */
export const errorCodeLookup = errCode => {
  const CLIENT_ERROR_START_RANGE = -1;
  const NFS_ERROR_START_RANGE = CLIENT_ERROR_START_RANGE - 500;
  const DNS_ERROR_START_RANGE = NFS_ERROR_START_RANGE - 500;
  const FFI_ERROR_START_RANGE = DNS_ERROR_START_RANGE - 500;
  switch (errCode) {
    case CLIENT_ERROR_START_RANGE:
      return 'CoreError::StructuredDataHeaderSizeProhibitive';
    case CLIENT_ERROR_START_RANGE - 1:
      return 'CoreError::UnsuccessfulEncodeDecode';
    case CLIENT_ERROR_START_RANGE - 2:
      return 'CoreError::AsymmetricDecipherFailure';
    case CLIENT_ERROR_START_RANGE - 3:
      return 'CoreError::SymmetricDecipherFailure';
    case CLIENT_ERROR_START_RANGE - 4:
      return 'CoreError::ReceivedUnexpectedData';
    case CLIENT_ERROR_START_RANGE - 5:
      return 'CoreError::VersionCacheMiss';
    case CLIENT_ERROR_START_RANGE - 6:
      return 'CoreError::RootDirectoryAlreadyExists';
    case CLIENT_ERROR_START_RANGE - 7:
      return 'CoreError::RandomDataGenerationFailure';
    case CLIENT_ERROR_START_RANGE - 8:
      return 'CoreError::OperationForbiddenForClient';
    case CLIENT_ERROR_START_RANGE - 9:
      return 'CoreError::Unexpected';
    case CLIENT_ERROR_START_RANGE - 10:
      return 'CoreError::RoutingError';
    case CLIENT_ERROR_START_RANGE - 11:
      return 'CoreError::RoutingInterfaceError';
    case CLIENT_ERROR_START_RANGE - 12:
      return 'CoreError::UnsupportedSaltSizeForPwHash';
    case CLIENT_ERROR_START_RANGE - 13:
      return 'CoreError::UnsuccessfulPwHash';
    case CLIENT_ERROR_START_RANGE - 14:
      return 'CoreError::OperationAborted';
    case CLIENT_ERROR_START_RANGE - 15:
      return 'CoreError::MpidMessagingError';
    case CLIENT_ERROR_START_RANGE - 16:
      return 'CoreError::GetFailure::GetError::NoSuchAccount';
    case CLIENT_ERROR_START_RANGE - 17:
      return 'CoreError::GetFailure::GetError::NoSuchData';
    case CLIENT_ERROR_START_RANGE - 18:
      return 'CoreError::GetFailure::GetError::NetworkOther';
    case CLIENT_ERROR_START_RANGE - 19:
      return 'CoreError::MutationFailure::MutationError::NoSuchAccount';
    case CLIENT_ERROR_START_RANGE - 20:
      return 'CoreError::MutationFailure::MutationError::AccountExists';
    case CLIENT_ERROR_START_RANGE - 21:
      return 'CoreError::MutationFailure::MutationError::NoSuchData';
    case CLIENT_ERROR_START_RANGE - 22:
      return 'CoreError::MutationFailure::MutationError::DataExists';
    case CLIENT_ERROR_START_RANGE - 23:
      return 'CoreError::MutationFailure::MutationError::LowBalance';
    case CLIENT_ERROR_START_RANGE - 24:
      return 'CoreError::MutationFailure::MutationError::InvalidSuccessor';
    case CLIENT_ERROR_START_RANGE - 25:
      return 'CoreError::MutationFailure::MutationError::InvalidOperation';
    case CLIENT_ERROR_START_RANGE - 26:
      return 'CoreError::MutationFailure::MutationError::NetworkOther';
    case CLIENT_ERROR_START_RANGE - 27:
      return 'CoreError::MutationFailure::MutationError::NetworkFull';
    case CLIENT_ERROR_START_RANGE - 28:
      return 'CoreError::MutationFailure::MutationError::DataTooLarge';
    case CLIENT_ERROR_START_RANGE - 29:
      return 'CoreError::MutationFailure::MutationError::InvalidInvitation';
    case CLIENT_ERROR_START_RANGE - 30:
      return 'CoreError::MutationFailure::MutationError::InvitationAlreadyClaimed';
    case CLIENT_ERROR_START_RANGE - 31:
      return 'CoreError::SelfEncryption::SelfEncryptionCompressionError';
    case CLIENT_ERROR_START_RANGE - 32:
      return 'CoreError::SelfEncryption::SelfEncryptionDecryptionError';
    case CLIENT_ERROR_START_RANGE - 33:
      return 'CoreError::GetAccountInfoFailure::SelfEncryptionIoError';
    case CLIENT_ERROR_START_RANGE - 34:
      return 'CoreError::GetAccountInfoFailure::GetError::NoSuchAccount';
    case CLIENT_ERROR_START_RANGE - 35:
      return 'CoreError::GetAccountInfoFailure';
    case CLIENT_ERROR_START_RANGE - 36:
      return 'CoreError::RequestTimeout';
    case CLIENT_ERROR_START_RANGE - 37:
      return 'CoreError::InvalidStructuredDataTypeTag';
    case NFS_ERROR_START_RANGE - 1:
      return 'NfsError::DirectoryAlreadyExistsWithSameName';
    case NFS_ERROR_START_RANGE - 2:
      return 'NfsError::DestinationAndSourceAreSame';
    case NFS_ERROR_START_RANGE - 3:
      return 'NfsError::DirectoryNotFound';
    case NFS_ERROR_START_RANGE - 4:
      return 'NfsError::FileAlreadyExistsWithSameName';
    case NFS_ERROR_START_RANGE - 5:
      return 'NfsError::FileDoesNotMatch';
    case NFS_ERROR_START_RANGE - 6:
      return 'NfsError::FileNotFound';
    case NFS_ERROR_START_RANGE - 7:
      return 'NfsError::InvalidRangeSpecified';
    case NFS_ERROR_START_RANGE - 8:
      return 'NfsError::ParameterIsNotValid';
    case NFS_ERROR_START_RANGE - 9:
      return 'NfsError::Unexpected';
    case NFS_ERROR_START_RANGE - 10:
      return 'NfsError::UnsuccessfulEncodeDecode';
    case NFS_ERROR_START_RANGE - 11:
      return 'NfsError::SelfEncryption::SelfEncryptionCompressionError';
    case NFS_ERROR_START_RANGE - 12:
      return 'NfsError::SelfEncryption::SelfEncryptionDecryptionError';
    case NFS_ERROR_START_RANGE - 13:
      return 'NfsError::SelfEncryption::SelfEncryptionIoError';
    case DNS_ERROR_START_RANGE:
      return 'DnsError::DnsNameAlreadyRegistered';
    case DNS_ERROR_START_RANGE - 1:
      return 'DnsError::DnsRecordNotFound';
    case DNS_ERROR_START_RANGE - 2:
      return 'DnsError::ServiceAlreadyExists';
    case DNS_ERROR_START_RANGE - 3:
      return 'DnsError::ServiceNotFound';
    case DNS_ERROR_START_RANGE - 4:
      return 'DnsError::DnsConfigFileNotFoundOrCorrupted';
    case DNS_ERROR_START_RANGE - 5:
      return 'DnsError::Unexpected';
    case DNS_ERROR_START_RANGE - 6:
      return 'DnsError::UnsuccessfulEncodeDecode';
    case FFI_ERROR_START_RANGE - 1:
      return 'FfiError::PathNotFound';
    case FFI_ERROR_START_RANGE - 2:
      return 'FfiError::InvalidPath';
    case FFI_ERROR_START_RANGE - 3:
      return 'FfiError::PermissionDenied';
    case FFI_ERROR_START_RANGE - 8:
      return 'FfiError::LocalConfigAccessFailed';
    case FFI_ERROR_START_RANGE - 9:
      return 'FfiError::Unexpected';
    case FFI_ERROR_START_RANGE - 10:
      return 'FfiError::UnsuccessfulEncodeDecode';
    case FFI_ERROR_START_RANGE - 11:
      return 'FfiError::NulError';
    case FFI_ERROR_START_RANGE - 12:
      return 'FfiError::InvalidStructDataHandle';
    case FFI_ERROR_START_RANGE - 13:
      return 'FfiError::InvalidDataIdHandle';
    case FFI_ERROR_START_RANGE - 14:
      return 'FfiError::InvalidAppendableDataHandle';
    case FFI_ERROR_START_RANGE - 15:
      return 'FfiError::InvalidSelfEncryptorHandle';
    case FFI_ERROR_START_RANGE - 16:
      return 'FfiError::InvalidCipherOptHandle';
    case FFI_ERROR_START_RANGE - 17:
      return 'FfiError::InvalidEncryptKeyHandle';
    case FFI_ERROR_START_RANGE - 18:
      return 'FfiError::InvalidSignKeyHandle';
    case FFI_ERROR_START_RANGE - 19:
      return 'FfiError::OperationForbiddenForApp';
    case FFI_ERROR_START_RANGE - 20:
      return 'FfiError::InvalidStructuredDataTypeTag';
    case FFI_ERROR_START_RANGE - 21:
      return 'FfiError::InvalidVersionNumber';
    case FFI_ERROR_START_RANGE - 22:
      return 'FfiError::InvalidSelfEncryptorReadOffsets';
    case FFI_ERROR_START_RANGE - 23:
      return 'FfiError::InvalidIndex';
    case FFI_ERROR_START_RANGE - 24:
      return 'FfiError::UnsupportedOperation';
    default:
      return 'Unexpected error';
  }
};
